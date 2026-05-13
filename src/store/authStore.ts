import { create } from 'zustand';
// Temporarily disable persist middleware to debug Electron crash
// import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  // Temporarily disable persist
  // persist(
  (set) => ({
    user: null,
    isAuthenticated: false,
    login: (user) => set({ user, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
    updateUser: (user) => set({ user }),
  })
  // ,
  // {
  //   name: 'auth-storage',
  // }
  // )
);
