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
  login: (email: string, accessToken: string, role?: 'USER' | 'ADMIN', nickname?: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoggedIn: typeof window !== 'undefined' && Boolean(sessionStorage.getItem('accessToken')),
  nicknamesByEmail: {},
  login: (email, accessToken, role = 'USER', nickname) => {
    sessionStorage.setItem('accessToken', accessToken);
    set((state) => ({
      isLoggedIn: true,
      user: {
        id: 1,
        email,
        nickname: nickname || state.nicknamesByEmail[email] || email.split('@')[0],
        phone: '',
        role,
      },
      nicknamesByEmail: nickname
        ? { ...state.nicknamesByEmail, [email]: nickname }
        : state.nicknamesByEmail,
    }));
  },
  logout: () => {
    sessionStorage.removeItem('accessToken');
    set({ user: null, isLoggedIn: false });
  },
  updateUser: (data) =>
    set((state) => {
      if (!state.user) return { user: null };

      return {
        user: { ...state.user, ...data },
        nicknamesByEmail: data.nickname !== undefined
          ? { ...state.nicknamesByEmail, [state.user.email]: data.nickname }
          : state.nicknamesByEmail,
      };
    }),
}));
