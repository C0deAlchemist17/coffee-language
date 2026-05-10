import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductInput } from '../types';
import { prisma } from '../utils/prisma';

export const useProducts = () => {
  const queryClient = useQueryClient();

  const products = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      return await prisma.product.findMany({
        include: {
          category: true,
          variants: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    },
  });

  const createProduct = useMutation({
    mutationFn: async (data: ProductInput & { image?: string }) => {
      return await prisma.product.create({
        data: {
          name: data.name,
          nameAr: data.nameAr,
          barcode: data.barcode,
          description: data.description,
          categoryId: data.categoryId,
          price: data.price,
          cost: data.cost,
          stock: data.stock,
          minStock: data.minStock,
          image: data.image,
        },
        include: { category: true },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductInput & { image?: string } }) => {
      return await prisma.product.update({
        where: { id },
        data: {
          name: data.name,
          nameAr: data.nameAr,
          barcode: data.barcode,
          description: data.description,
          categoryId: data.categoryId,
          price: data.price,
          cost: data.cost,
          stock: data.stock,
          minStock: data.minStock,
          image: data.image,
        },
        include: { category: true },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      return await prisma.product.delete({
        where: { id },
      });
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
