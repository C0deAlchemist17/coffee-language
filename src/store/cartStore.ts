import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  tableId?: string;
  customerId?: string;
  orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  notes?: string;
  discount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  updateNotes: (productId: string, notes: string, variantId?: string) => void;
  clearCart: () => void;
  setTableId: (tableId?: string) => void;
  setCustomerId: (customerId?: string) => void;
  setOrderType: (type: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY') => void;
  setNotes: (notes?: string) => void;
  setDiscount: (discount: number) => void;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      orderType: 'DINE_IN',
      discount: 0,

      addItem: (item) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );
          
          if (existingIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + item.quantity,
            };
            return { items: newItems };
          }
          
          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      updateNotes: (productId, notes, variantId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, notes }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      setTableId: (tableId) => set({ tableId }),
      setCustomerId: (customerId) => set({ customerId }),
      setOrderType: (orderType) => set({ orderType }),
      setNotes: (notes) => set({ notes }),
      setDiscount: (discount) => set({ discount }),

      getSubtotal: () => {
        const state = get();
        return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getTotal: () => {
        const state = get();
        const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return subtotal - state.discount;
      },
    }),
    {
      name: 'coffee-cart',
    }
  )
);
