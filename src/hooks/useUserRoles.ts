
import { useState, useEffect } from 'react';
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

    fetchUserRole();
  }, [user]);

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
