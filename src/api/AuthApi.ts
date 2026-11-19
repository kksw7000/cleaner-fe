import { apiClient } from "@/api/ApiClient";
import type { MyPageResponse, SignupResponse, TokenResponse } from "@/api/contracts";

/** 이메일·비밀번호 로그인은 백엔드의 실제 /api/auth/login 계약으로만 호출합니다. */
export async function login(email: string, password: string): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>("/api/auth/login", { email, password });
  return data;
}

/** 회원가입은 화면의 닉네임·전화번호를 백엔드의 name·phoneNumber 계약으로 전달합니다. */
export async function signup(
  email: string,
  password: string,
  name: string,
  phoneNumber: string,
): Promise<SignupResponse> {
  const { data } = await apiClient.post<SignupResponse>("/api/auth/signup", {
    email,
    password,
    name,
    phoneNumber,
  });
  return data;
}

/** 로그아웃 API를 호출해 브라우저의 HttpOnly Refresh Token 쿠키를 만료시킵니다. */
export async function logoutFromServer(): Promise<void> {
  await apiClient.post('/api/auth/logout');
}

export async function getCurrentProfile(): Promise<MyPageResponse> {
  const { data } = await apiClient.get<MyPageResponse>('/api/mypage');
  return data;
}
