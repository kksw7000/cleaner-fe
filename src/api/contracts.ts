/** 현재 Spring Boot가 반환하는 로그인 토큰 DTO와 일치하는 최소 인증 응답입니다. */
export interface TokenResponse {
  accessToken: string;
  tokenType: string;
  accessTokenExpiresIn: number;
}

/** 실제 마이페이지 API는 /users/me가 아닌 /api/mypage를 사용합니다. */
export interface MyPageResponse {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
}
