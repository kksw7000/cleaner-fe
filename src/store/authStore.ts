import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  nickname: string;
  phone: string;
  role: 'USER' | 'ADMIN';
}

interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, role?: 'USER' | 'ADMIN') => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoggedIn: false,
  login: (email, role = 'USER') =>
    set({
      isLoggedIn: true,
      user: {
        id: 1,
        email,
        nickname: email.split('@')[0],
        phone: '010-0000-0000',
        role,
      },
    }),
  logout: () => set({ user: null, isLoggedIn: false }),
  updateUser: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),
}));
