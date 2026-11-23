import { create } from 'zustand';
import axios from 'axios';
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
  restoreFailed: boolean;
  nicknamesByEmail: Record<string, string>;
  login: (email: string, accessToken: string, role?: 'USER' | 'ADMIN', nickname?: string) => void;
  logout: () => void;
  restoreSession: (showLoading?: boolean) => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoggedIn: false,
  isInitializing: typeof window !== 'undefined' && Boolean(sessionStorage.getItem('accessToken')),
  restoreFailed: false,
  nicknamesByEmail: {},
  login: (email, accessToken, role = 'USER', nickname) => {
    advanceSessionGeneration();
    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('userRole', role);
    set((state) => ({
      isLoggedIn: true,
      isInitializing: false,
      restoreFailed: false,
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
    set({ user: null, isLoggedIn: false, isInitializing: false, restoreFailed: false });
  },
  restoreSession: async (showLoading = true) => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      set({ user: null, isLoggedIn: false, isInitializing: false, restoreFailed: false });
      return;
    }
    const generation = getSessionGeneration();
    // 로그인 직후의 프로필 보강은 현재 라우터를 유지해야 하므로 전체 화면 로딩을 표시하지 않습니다.
    if (showLoading) {
      set({ isInitializing: true, restoreFailed: false });
    } else {
      set({ restoreFailed: false });
    }
    try {
      const profile = await getCurrentProfile();
      if (getSessionGeneration() !== generation) return;
      set((state) => ({
        user: {
          id: profile.id,
          email: profile.email,
          nickname: profile.name || state.nicknamesByEmail[profile.email] || profile.email.split('@')[0],
          phone: profile.phoneNumber,
          // 구버전 서버 응답에 role이 없더라도 로그인 시 확정한 권한을 잃지 않습니다.
          role: profile.role === 'ADMIN' || profile.role === 'USER'
            ? profile.role
            : state.user?.role || (sessionStorage.getItem('userRole') === 'ADMIN' ? 'ADMIN' : 'USER'),
        },
        isLoggedIn: true,
        isInitializing: false,
        restoreFailed: false,
      }));
    } catch (error: unknown) {
      if (getSessionGeneration() !== generation) return;
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        advanceSessionGeneration();
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('userRole');
        set({ user: null, isLoggedIn: false, isInitializing: false, restoreFailed: false });
        return;
      }
      set({ isInitializing: false, restoreFailed: true });
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
