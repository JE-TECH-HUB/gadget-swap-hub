
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface SwapRequest {
  id: string;
  requester_id: string;
  product_id: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  product?: {
    id: string;
    name: string;
    image_url: string | null;
    price: number;
    owner_id: string;
  };
  requester?: {
    id: string;
    email: string;
    full_name: string | null;
  };
}

export const useSwapRequests = (user: User | null) => {
  const [swapRequests, setSwapRequests] = useState<{
    received: SwapRequest[];
    sent: SwapRequest[];
  }>({
    received: [],
    sent: []
  });
  const [loading, setLoading] = useState(false);

  const sendSwapRequest = async (productId: string, message: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('swap_requests')
        .insert({
          requester_id: user.id,
          product_id: productId,
          message: message,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending swap request:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error sending swap request:', error);
      return false;
    }
  };

  const getSwapRequests = async () => {
    if (!user) return { received: [], sent: [] };

    try {
      setLoading(true);

      // Get swap requests received (for user's products)
      const { data: receivedData, error: receivedError } = await supabase
        .from('swap_requests')
        .select(`
          *,
          products!inner(id, name, image_url, price, owner_id)
        `)
        .eq('products.owner_id', user.id)
        .order('created_at', { ascending: false });

      if (receivedError) {
        console.error('Error fetching received swap requests:', receivedError);
      }

      // Get swap requests sent by user
      const { data: sentData, error: sentError } = await supabase
        .from('swap_requests')
        .select(`
          *,
          products(id, name, image_url, price, owner_id)
        `)
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false });

      if (sentError) {
        console.error('Error fetching sent swap requests:', sentError);
      }

      // Get requester profiles for received requests
      const requesterIds = (receivedData || []).map(r => r.requester_id);
      let requesterProfiles: any[] = [];
      
      if (requesterIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .in('id', requesterIds);
        
        if (!profilesError) {
          requesterProfiles = profilesData || [];
        }
      }

      const received: SwapRequest[] = (receivedData || []).map(request => ({
        ...request,
        status: request.status as 'pending' | 'accepted' | 'rejected',
        product: request.products,
        requester: requesterProfiles.find(p => p.id === request.requester_id)
      }));

      const sent: SwapRequest[] = (sentData || []).map(request => ({
        ...request,
        status: request.status as 'pending' | 'accepted' | 'rejected',
        product: request.products,
        requester: undefined // Not needed for sent requests
      }));

      setSwapRequests({ received, sent });
      return { received, sent };
    } catch (error) {
      console.error('Error fetching swap requests:', error);
      return { received: [], sent: [] };
    } finally {
      setLoading(false);
    }
  };

  const updateSwapRequest = async (requestId: string, status: 'accepted' | 'rejected'): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('swap_requests')
        .update({ status })
        .eq('id', requestId);

      if (error) {
        console.error('Error updating swap request:', error);
        return false;
      }

      // Refresh the swap requests after update
      await getSwapRequests();
      return true;
    } catch (error) {
      console.error('Error updating swap request:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      getSwapRequests();
    }
  }, [user]);

  return {
    swapRequests,
    loading,
    sendSwapRequest,
    getSwapRequests,
    updateSwapRequest,
  };
};
