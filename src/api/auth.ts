import { apiClient } from "@/api/client";
import type { TokenResponse } from "@/api/contracts";

/** 이메일·비밀번호 로그인은 백엔드의 실제 /api/auth/login 계약으로만 호출합니다. */
export async function login(email: string, password: string): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>("/api/auth/login", { email, password });
  return data;
}
