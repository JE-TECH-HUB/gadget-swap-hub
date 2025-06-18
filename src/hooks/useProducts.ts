
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  status: "available" | "sold" | "swapped";
  category: string;
  location?: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export const useProducts = (user: User | null) => {
  const getProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    return (data || []).map(product => ({
      ...product,
      status: product.status as "available" | "sold" | "swapped"
    }));
  };

  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'owner_id'>): Promise<Product | null> => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('products')
      .insert({ ...product, owner_id: user.id })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding product:', error);
      return null;
    }
    
    return {
      ...data,
      status: data.status as "available" | "sold" | "swapped"
    };
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .eq('owner_id', user.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      return null;
    }
    
    return {
      ...data,
      status: data.status as "available" | "sold" | "swapped"
    };
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    if (!user) return false;
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id);
    
    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }
    
    return true;
  };

  return {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
