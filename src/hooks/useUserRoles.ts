
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'user';

interface UserRoleData {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export const useUserRoles = (user: User | null) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setUserRole('user'); // Default to user role
        } else {
          setUserRole(data.role as UserRole);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('user');
      } finally {
        setLoading(false);
      }
    };

    // Cleanup any existing subscription first
    const cleanup = () => {
      if (channelRef.current && isSubscribedRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };

    cleanup();
    fetchUserRole();

    // Only set up real-time subscription if user exists and we haven't already subscribed
    if (!user || isSubscribedRef.current) return;

    // Set up real-time subscription for role changes
    const channel = supabase
      .channel(`user-role-changes-${user.id}-${Date.now()}`) // Add timestamp to make channel unique
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_roles',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Role updated:', payload);
          setUserRole(payload.new.role as UserRole);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          isSubscribedRef.current = true;
        }
      });

    // Store the channel reference
    channelRef.current = channel;

    return cleanup;
  }, [user?.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current && isSubscribedRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, []);

  const getAllUserRoles = async (): Promise<UserRoleData[]> => {
    if (!user || userRole !== 'admin') return [];

    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all user roles:', error);
      return [];
    }

    return data || [];
  };

  const updateUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
    if (!user || userRole !== 'admin') return false;

    const { error } = await supabase
      .from('user_roles')
      .update({ role })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating user role:', error);
      return false;
    }

    return true;
  };

  const isAdmin = userRole === 'admin';

  return {
    userRole,
    loading,
    isAdmin,
    getAllUserRoles,
    updateUserRole,
  };
};
