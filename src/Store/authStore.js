import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { normalizeRole, normalizeUserProfile } from '@/lib/auth';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) =>
        set({
          user: userData ? normalizeUserProfile(userData) : null,
          isAuthenticated: Boolean(userData),
        }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (data) =>
        set((state) => ({
          user: normalizeUserProfile(data, state.user || {}),
        })),
    }),
    {
      name: 'auth-storage', // unique name
    }
  )
);
