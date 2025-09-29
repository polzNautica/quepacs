import { create } from "zustand";

interface LoadingState {
  loading: boolean;
  setLoading: (val: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  loading: true,
  setLoading: (val) => set({ loading: val }),
}));
