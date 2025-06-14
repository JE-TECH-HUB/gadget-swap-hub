
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

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

interface SwapRequest {
  id: string;
  requester_id: string;
  product_id: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

export const useSupabase = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: fullName || email
        }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

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

  const uploadImage = async (file: File): Promise<string | null> => {
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

  const sendSwapRequest = async (productId: string, message: string): Promise<SwapRequest | null> => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('swap_requests')
      .insert({
        requester_id: user.id,
        product_id: productId,
        message,
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error sending swap request:', error);
      return null;
    }
    
    return {
      ...data,
      status: data.status as "pending" | "accepted" | "rejected"
    };
  };

  const getSwapRequests = async (): Promise<{ received: any[], sent: any[] }> => {
    if (!user) return { received: [], sent: [] };
    
    // Get products owned by current user to find swap requests for them
    const { data: userProducts } = await supabase
      .from('products')
      .select('id')
      .eq('owner_id', user.id);
    
    const productIds = userProducts?.map(p => p.id) || [];
    
    const [receivedResponse, sentResponse] = await Promise.all([
      // Received requests (for user's products)
      productIds.length > 0 ? supabase
        .from('swap_requests')
        .select(`
          *,
          products!inner(*)
        `)
        .in('product_id', productIds) : { data: [] },
      // Sent requests (by current user)
      supabase
        .from('swap_requests')
        .select(`
          *,
          products(*)
        `)
        .eq('requester_id', user.id)
    ]);
    
    return {
      received: (receivedResponse.data || []).map(request => ({
        ...request,
        status: request.status as "pending" | "accepted" | "rejected"
      })),
      sent: (sentResponse.data || []).map(request => ({
        ...request,
        status: request.status as "pending" | "accepted" | "rejected"
      }))
    };
  };

  const updateSwapRequest = async (id: string, status: "accepted" | "rejected"): Promise<SwapRequest | null> => {
    const { data, error } = await supabase
      .from('swap_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating swap request:', error);
      return null;
    }
    
    return {
      ...data,
      status: data.status as "pending" | "accepted" | "rejected"
    };
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    getProfile,
    updateProfile,
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    sendSwapRequest,
    getSwapRequests,
    updateSwapRequest,
  };
};
