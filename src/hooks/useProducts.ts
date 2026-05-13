import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductInput } from '../types';
// CRITICAL: Remove Prisma import - it's Node-only and crashes in browser
// import { prisma } from '../utils/prisma';

export const useProducts = () => {
  const queryClient = useQueryClient();

  const products = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      // TODO: Use IPC to communicate with main process for database operations
      // For now, return empty array to prevent crash
      return [];
    },
  });

  const createProduct = useMutation({
    mutationFn: async (data: ProductInput & { image?: string }) => {
      // TODO: Use IPC to communicate with main process
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductInput & { image?: string } }) => {
      // TODO: Use IPC to communicate with main process
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      // TODO: Use IPC to communicate with main process
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    products,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
