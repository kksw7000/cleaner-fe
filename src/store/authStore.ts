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
  nicknamesByEmail: Record<string, string>;
  login: (email: string, role?: 'USER' | 'ADMIN', nickname?: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoggedIn: false,
  nicknamesByEmail: {},
  login: (email, role = 'USER', nickname) =>
    set((state) => ({
      isLoggedIn: true,
      user: {
        id: 1,
        email,
        nickname: nickname || state.nicknamesByEmail[email] || email.split('@')[0],
        phone: '010-0000-0000',
        role,
      },
      nicknamesByEmail: nickname
        ? { ...state.nicknamesByEmail, [email]: nickname }
        : state.nicknamesByEmail,
    })),
  logout: () => set({ user: null, isLoggedIn: false }),
  updateUser: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),
}));
