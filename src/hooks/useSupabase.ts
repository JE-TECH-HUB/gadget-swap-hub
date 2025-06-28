
import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { useProfiles } from './useProfiles';
import { useProducts } from './useProducts';
import { useSwapRequests } from './useSwapRequests';
import { useUserRoles } from './useUserRoles';
import { uploadImage } from '@/utils/supabaseStorage';

export const useSupabase = () => {
  const { user, session, loading, signUp, signIn, signOut } = useAuth();
  const { getProfile, updateProfile } = useProfiles(user);
  const { getProducts, addProduct, updateProduct, deleteProduct } = useProducts(user);
  const { sendSwapRequest, getSwapRequests, updateSwapRequest } = useSwapRequests(user);
  const { userRole, isAdmin, getAllUserRoles, updateUserRole } = useUserRoles(user);

  const uploadImageWrapper = async (file: File): Promise<string | null> => {
    return uploadImage(file, user);
  };

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
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
    uploadImage: uploadImageWrapper,
    createSwapRequest: sendSwapRequest,
    sendSwapRequest,
    getSwapRequests,
    updateSwapRequest,
    userRole,
    isAdmin,
    getAllUserRoles,
    updateUserRole,
  }), [
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
    sendSwapRequest,
    getSwapRequests,
    updateSwapRequest,
    userRole,
    isAdmin,
    getAllUserRoles,
    updateUserRole,
  ]);
};
