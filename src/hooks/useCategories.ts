import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CategoryInput } from '../types';
// CRITICAL: Remove Prisma import - it's Node-only and crashes in browser
// import { prisma } from '../utils/prisma';

export const useCategories = () => {
  const queryClient = useQueryClient();

  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // TODO: Use IPC to communicate with main process for database operations
      // For now, return empty array to prevent crash
      return [];
    },
  });

  const createCategory = useMutation({
    mutationFn: async (data: CategoryInput) => {
      // TODO: Use IPC to communicate with main process
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategoryInput }) => {
      // TODO: Use IPC to communicate with main process
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      // TODO: Use IPC to communicate with main process
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return {
    categories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
