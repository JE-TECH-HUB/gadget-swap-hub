
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const uploadImage = async (file: File, user: User | null): Promise<string | null> => {
  if (!user) {
    console.error('User not authenticated');
    return null;
  }
  
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random()}.${fileExt}`;
    
    console.log('Uploading image:', fileName);
    
    const { data, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }
    
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);
    
    console.log('Image uploaded successfully:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    return null;
  }
};

export const deleteImage = async (imageUrl: string, user: User | null): Promise<boolean> => {
  if (!user || !imageUrl) return false;
  
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/product-images/');
    if (urlParts.length < 2) return false;
    
    const filePath = urlParts[1];
    
    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath]);
    
    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteImage:', error);
    return false;
  }
};
