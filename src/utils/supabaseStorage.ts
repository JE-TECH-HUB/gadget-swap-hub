
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const uploadImage = async (file: File, user: User | null): Promise<string | null> => {
  if (!user) return null;
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Math.random()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(fileName, file);
  
  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return null;
  }
  
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);
  
  return data.publicUrl;
};
