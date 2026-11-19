import axios, { type InternalAxiosRequestConfig } from "axios";
import type { TokenResponse } from "@/api/contracts";
import { getSessionGeneration } from "@/api/sessionGeneration";

/** API 주소는 배포 환경마다 달라지므로 Vite 환경 변수에서만 읽고 코드에는 서버 주소를 남기지 않습니다. */
export const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? undefined : import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

const authRefreshClient = axios.create({
  baseURL: import.meta.env.DEV ? undefined : import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

let refreshRequest: { generation: number; promise: Promise<string> } | null = null;

/** Refresh Token 쿠키로 Access Token을 갱신하고 동시 만료 요청은 하나의 요청으로 합칩니다. */
export function refreshAccessToken(): Promise<string> {
  const generation = getSessionGeneration();
  if (refreshRequest?.generation === generation) return refreshRequest.promise;

  const promise = authRefreshClient
      .post<TokenResponse>("/api/auth/refresh")
      .then(({ data }) => {
        if (getSessionGeneration() !== generation) throw new Error("Session changed during token refresh");
        sessionStorage.setItem("accessToken", data.accessToken);
        return data.accessToken;
      })
      .catch((error: unknown) => {
        if (getSessionGeneration() === generation && axios.isAxiosError(error) && error.response?.status === 401) {
          sessionStorage.removeItem("accessToken");
          window.dispatchEvent(new Event("auth:expired"));
        }
        throw error;
      })
      .finally(() => {
        if (refreshRequest?.promise === promise) refreshRequest = null;
      });
  refreshRequest = { generation, promise };
  return promise;
}

/** Access Token은 매 요청에서만 붙여 XSS 노출 범위를 줄이고, Refresh Token은 HttpOnly 쿠키에 맡깁니다. */
apiClient.interceptors.request.use((config) => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/** Access Token 만료 시 한 번만 갱신하고 원래 요청을 재시도해 화면 작업이 중단되지 않게 합니다. */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config) {
      return Promise.reject(error);
    }

    const config = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (config._retry || config.url?.startsWith("/api/auth/")) {
      return Promise.reject(error);
    }

    config._retry = true;
    const generation = getSessionGeneration();
    const accessToken = await refreshAccessToken();
    if (getSessionGeneration() !== generation) return Promise.reject(error);
    config.headers.Authorization = `Bearer ${accessToken}`;
    return apiClient(config);
  },
);
