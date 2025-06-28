
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  product_id: string;
  user_id: string;
  quantity: number;
  created_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    category: string;
    location: string | null;
    status: string;
    owner_id: string;
  };
}

export const useCart = (user: User | null) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCartItems = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (
            id,
            name,
            price,
            image_url,
            category,
            location,
            status,
            owner_id
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToCart = async (productId: string, quantity: number = 1): Promise<boolean> => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return false;
    }

    try {
      // Check if item already exists in cart
      const existing = cartItems.find(item => item.product_id === productId);
      
      if (existing) {
        return await updateQuantity(existing.id, existing.quantity + quantity);
      }

      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity
        });

      if (error) throw error;

      await fetchCartItems();
      toast.success('Item added to cart');
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
      return false;
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number): Promise<boolean> => {
    if (quantity < 1) return false;

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)
        .eq('user_id', user?.id);

      if (error) throw error;

      await fetchCartItems();
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
      return false;
    }
  };

  const removeFromCart = async (cartItemId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', user?.id);

      if (error) throw error;

      await fetchCartItems();
      toast.success('Item removed from cart');
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item');
      return false;
    }
  };

  const clearCart = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setCartItems([]);
      toast.success('Cart cleared');
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
      return false;
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + ((item.product?.price || 0) * item.quantity);
  }, 0);

  return {
    cartItems,
    loading,
    totalItems,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCartItems
  };
};
