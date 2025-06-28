
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSupabase } from './useSupabase';
import { toast } from 'sonner';

interface CachedData {
  products: any[];
  users: any[];
  swapRequests: { received: any[]; sent: any[] };
  lastFetch: Date;
}

export const useOptimizedData = () => {
  const { getProducts, getSwapRequests, getAllUserRoles } = useSupabase();
  const [data, setData] = useState<CachedData | null>(null);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef<CachedData | null>(null);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const fetchAllData = useCallback(async (force = false) => {
    const now = new Date();
    
    // Check if we have recent cached data
    if (!force && cacheRef.current && 
        now.getTime() - cacheRef.current.lastFetch.getTime() < CACHE_DURATION) {
      setData(cacheRef.current);
      return cacheRef.current;
    }

    setLoading(true);
    try {
      // Fetch all data in parallel for better performance
      const [products, swapRequestsData, userRoles] = await Promise.all([
        getProducts(),
        getSwapRequests(),
        getAllUserRoles()
      ]);

      const newData: CachedData = {
        products,
        users: userRoles,
        swapRequests: swapRequestsData,
        lastFetch: now
      };

      cacheRef.current = newData;
      setData(newData);
      return newData;
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getProducts, getSwapRequests, getAllUserRoles]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const refreshData = useCallback(() => {
    return fetchAllData(true);
  }, [fetchAllData]);

  return {
    data,
    loading,
    refreshData,
    isStale: data ? new Date().getTime() - data.lastFetch.getTime() > CACHE_DURATION : false
  };
};
