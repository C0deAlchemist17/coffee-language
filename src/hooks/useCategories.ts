import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CategoryInput } from '../types';
import { prisma } from '../utils/prisma';

export const useCategories = () => {
  const queryClient = useQueryClient();

  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      return await prisma.category.findMany({
        orderBy: { sortOrder: 'asc' },
      });
    },
  });

  const createCategory = useMutation({
    mutationFn: async (data: CategoryInput) => {
      return await prisma.category.create({
        data: {
          name: data.name,
          nameAr: data.nameAr,
          description: data.description,
          color: data.color,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategoryInput }) => {
      return await prisma.category.update({
        where: { id },
        data: {
          name: data.name,
          nameAr: data.nameAr,
          description: data.description,
          color: data.color,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      return await prisma.category.delete({
        where: { id },
      });
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
