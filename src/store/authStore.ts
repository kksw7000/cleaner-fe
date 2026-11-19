import { create } from 'zustand';
import { getCurrentProfile } from '@/api/AuthApi';
import { advanceSessionGeneration, getSessionGeneration } from '@/api/sessionGeneration';

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
  isInitializing: boolean;
  nicknamesByEmail: Record<string, string>;
  login: (email: string, accessToken: string, role?: 'USER' | 'ADMIN', nickname?: string) => void;
  logout: () => void;
  restoreSession: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoggedIn: false,
  isInitializing: typeof window !== 'undefined' && Boolean(sessionStorage.getItem('accessToken')),
  nicknamesByEmail: {},
  login: (email, accessToken, role = 'USER', nickname) => {
    advanceSessionGeneration();
    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('userRole', role);
    set((state) => ({
      isLoggedIn: true,
      isInitializing: false,
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
    advanceSessionGeneration();
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userRole');
    set({ user: null, isLoggedIn: false, isInitializing: false });
  },
  restoreSession: async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      set({ user: null, isLoggedIn: false, isInitializing: false });
      return;
    }
    const generation = getSessionGeneration();
    set({ isInitializing: true });
    try {
      const profile = await getCurrentProfile();
      if (getSessionGeneration() !== generation || sessionStorage.getItem('accessToken') !== accessToken) return;
      set((state) => ({
        user: {
          id: profile.id,
          email: profile.email,
          nickname: profile.name || state.nicknamesByEmail[profile.email] || profile.email.split('@')[0],
          phone: profile.phoneNumber,
          role: sessionStorage.getItem('userRole') === 'ADMIN' ? 'ADMIN' : 'USER',
        },
        isLoggedIn: true,
        isInitializing: false,
      }));
    } catch {
      if (getSessionGeneration() === generation) set({ user: null, isLoggedIn: false, isInitializing: false });
    }
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
