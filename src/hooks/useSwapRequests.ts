
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface SwapRequest {
  id: string;
  requester_id: string;
  product_id: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

export const useSwapRequests = (user: User | null) => {
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
    sendSwapRequest,
    getSwapRequests,
    updateSwapRequest,
  };
};
