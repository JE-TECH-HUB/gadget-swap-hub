
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  location?: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfiles = (user: User | null) => {
  const getProfile = async (): Promise<Profile | null> => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data;
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<Profile | null> => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }
    
    return data;
  };

  return {
    getProfile,
    updateProfile,
  };
};
