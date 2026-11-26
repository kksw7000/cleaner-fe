import { create } from 'zustand';
import axios from 'axios';
import { getCurrentProfile } from '@/api/AuthApi';
import { advanceSessionGeneration, getSessionGeneration } from '@/api/sessionGeneration';

/** 세션 복구로 채우는 현재 회원 정보이며 role은 관리자 라우트 분기에 사용합니다. */
interface User {
  id: number;
  email: string;
  nickname: string;
  phone: string;
  role: 'USER' | 'ADMIN';
}

/** 로그인 상태와 프로필 복구 동작을 앱 전체에서 공유하는 스토어 계약입니다. */
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

/** 인증 토큰과 회원 프로필을 관리해 컴포넌트 간 로그인 상태를 일관되게 유지합니다. */
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoggedIn: false,
  isInitializing: typeof window !== 'undefined' && Boolean(sessionStorage.getItem('accessToken')),
  restoreFailed: false,
  nicknamesByEmail: {},
  login: (email, accessToken, role = 'USER', nickname) => {
    // 새 로그인 세대를 시작해 이전 계정에서 늦게 도착한 프로필 응답을 차단합니다.
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
    // 세션 번호와 저장 토큰을 함께 초기화해 이전 요청이 로그아웃 상태를 덮지 못하게 합니다.
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
    // 프로필 응답이 오는 동안 계정이 바뀌었는지 비교하기 위해 요청 시작 시 세대 번호를 기억합니다.
    const generation = getSessionGeneration();
    // 로그인 직후의 프로필 보강은 현재 라우터를 유지해야 하므로 전체 화면 로딩을 표시하지 않습니다.
    if (showLoading) {
      set({ isInitializing: true, restoreFailed: false });
    } else {
      set({ restoreFailed: false });
    }
    try {
      const profile = await getCurrentProfile();
      // 이전 계정의 응답이면 현재 로그인 정보를 덮어쓰지 않습니다.
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
      // 로그아웃 또는 계정 전환 뒤 발생한 오류는 현재 세션의 실패로 처리하지 않습니다.
      if (getSessionGeneration() !== generation) return;
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        advanceSessionGeneration();
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('userRole');
        set({ user: null, isLoggedIn: false, isInitializing: false, restoreFailed: false });
        return;
      }
      // 로그인 직후의 선택적 프로필 보강 실패는 이미 완료된 인증과 화면 이용을 막지 않습니다.
      if (!showLoading) {
        set({ isInitializing: false, restoreFailed: false });
        return;
      }
      set({ isInitializing: false, restoreFailed: true });
    }
  },
  /** 수정된 프로필 필드만 병합하고 닉네임 캐시도 함께 동기화합니다. */
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
