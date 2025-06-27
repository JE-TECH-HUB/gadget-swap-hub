
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

// Super admin email that should be automatically promoted
const SUPER_ADMIN_EMAIL = 'tawfiqm857@gmail.com';

/**
 * Promotes a user to admin if they are the super admin
 * @param user - The authenticated user object
 * @returns Promise<boolean> - True if promotion was successful or not needed
 */
export const promoteUserIfSuperAdmin = async (user: User): Promise<boolean> => {
  try {
    // Check if this is the super admin email
    if (user.email !== SUPER_ADMIN_EMAIL) {
      return true; // Not super admin, no action needed
    }

    console.log('Super admin detected, checking current role...');

    // Check current role
    const { data: currentRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError && roleError.code !== 'PGRST116') {
      console.error('Error fetching user role:', roleError);
      return false;
    }

    // If already admin, no need to update
    if (currentRole?.role === 'admin') {
      console.log('Super admin already has admin role');
      return true;
    }

    // If no role exists, insert admin role
    if (!currentRole) {
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: 'admin' });

      if (insertError) {
        console.error('Error inserting admin role:', insertError);
        return false;
      }
    } else {
      // Update existing role to admin
      const { error: updateError } = await supabase
        .from('user_roles')
        .update({ role: 'admin' })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating to admin role:', updateError);
        return false;
      }
    }

    console.log('Super admin successfully promoted to admin role');
    return true;
  } catch (error) {
    console.error('Error in promoteUserIfSuperAdmin:', error);
    return false;
  }
};

/**
 * Checks if the current user has admin role
 * @param userId - The user ID to check
 * @returns Promise<boolean> - True if user is admin
 */
export const checkAdminAccess = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error checking admin access:', error);
      return false;
    }

    return data?.role === 'admin';
  } catch (error) {
    console.error('Error in checkAdminAccess:', error);
    return false;
  }
};
