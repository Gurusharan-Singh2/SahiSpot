import { create } from "zustand";

export const useStateStore = create((set) => ({
  isloginOpen: false,
  onLogin: () => set((state) => ({ isloginOpen: true })),
  onSignup: () => set((state) => ({ isloginOpen: false }))
}));
