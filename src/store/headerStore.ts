import { create } from 'zustand';

interface HeaderState {
  title: string;
  subtitle?: string;
  setHeader: (title: string, subtitle?: string) => void;
  clearHeader: () => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
  title: 'Dashboard',
  subtitle: undefined,
  setHeader: (title: string, subtitle?: string) => set({ title, subtitle }),
  clearHeader: () => set({ title: 'Dashboard', subtitle: undefined }),
}));


