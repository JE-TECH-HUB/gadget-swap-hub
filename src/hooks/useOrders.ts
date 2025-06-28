
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string;
  quantity: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'completed' | 'failed';
  created_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    category: string;
  };
}

export const useOrders = (user: User | null) => {
  const [loading, setLoading] = useState(false);

  const createOrder = async (cartItems: any[]): Promise<boolean> => {
    if (!user || cartItems.length === 0) return false;

    setLoading(true);
    try {
      const orders = cartItems.map(item => ({
        buyer_id: user.id,
        seller_id: item.product?.owner_id,
        product_id: item.product_id,
        quantity: item.quantity,
        total_amount: (item.product?.price || 0) * item.quantity,
        status: 'pending' as const,
        payment_status: 'pending' as const
      }));

      const { error } = await supabase
        .from('orders')
        .insert(orders);

      if (error) throw error;

      // Update product status to sold for quantity 1 items
      const singleQuantityItems = cartItems.filter(item => item.quantity === 1);
      if (singleQuantityItems.length > 0) {
        await supabase
          .from('products')
          .update({ status: 'sold' })
          .in('id', singleQuantityItems.map(item => item.product_id));
      }

      toast.success('Order placed successfully');
      return true;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getUserOrders = async (): Promise<Order[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (
            id,
            name,
            price,
            image_url,
            category
          )
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Properly map and cast the data
      const orders: Order[] = (data || []).map(order => ({
        ...order,
        status: order.status as 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled',
        payment_status: order.payment_status as 'pending' | 'completed' | 'failed',
        product: order.products ? {
          id: order.products.id,
          name: order.products.name,
          price: order.products.price,
          image_url: order.products.image_url,
          category: order.products.category
        } : undefined
      }));

      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  };

  return {
    loading,
    createOrder,
    getUserOrders
  };
};
