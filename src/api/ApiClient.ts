import axios from "axios";

/** API 주소는 배포 환경마다 달라지므로 Vite 환경 변수에서만 읽고 코드에는 서버 주소를 남기지 않습니다. */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

/** Access Token은 매 요청에서만 붙여 XSS 노출 범위를 줄이고, Refresh Token은 HttpOnly 쿠키에 맡깁니다. */
apiClient.interceptors.request.use((config) => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
