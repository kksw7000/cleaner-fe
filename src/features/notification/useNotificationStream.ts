import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { refreshAccessToken } from '@/api/ApiClient';
import { notificationKeys } from '@/features/notification/NotificationApi';
import { useAuthStore } from '@/store/authStore';

const apiBaseUrl = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

/** SSE 한 이벤트를 읽어 신규 알림일 때만 알림 캐시를 다시 조회합니다. */
function handleServerEvent(frame: string, onNotification: () => void): void {
  let eventName = 'message';
  const data: string[] = [];

  for (const line of frame.split(/\r?\n/)) {
    if (line.startsWith('event:')) {
      eventName = line.slice(6).trim();
    } else if (line.startsWith('data:')) {
      data.push(line.slice(5).trimStart());
    }
  }

  if (eventName === 'notification' && data.length > 0) {
    onNotification();
  }
}

/** 인증 헤더가 필요한 SSE 연결을 유지하고 끊긴 동안의 알림은 재조회로 동기화합니다. */
export function useNotificationStream(): void {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoggedIn) {
      queryClient.removeQueries({ queryKey: notificationKeys.all });
      return;
    }

    const controller = new AbortController();
    const invalidateNotifications = () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    };

    const connect = async () => {
      let retryDelay = 1000;

      while (!controller.signal.aborted) {
        try {
          const accessToken = sessionStorage.getItem('accessToken');
          if (!accessToken) {
            return;
          }

          const response = await fetch(`${apiBaseUrl}/api/notifications/stream`, {
            headers: {
              Accept: 'text/event-stream',
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: 'include',
            signal: controller.signal,
          });

          if (response.status === 401) {
            await refreshAccessToken();
            continue;
          }
          if (!response.ok) {
            throw new Error(`알림 스트림 연결에 실패했습니다. (HTTP ${response.status})`);
          }
          if (!response.body) {
            throw new Error('브라우저에서 알림 스트림 응답을 읽을 수 없습니다.');
          }

          retryDelay = 1000;
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          while (!controller.signal.aborted) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }

            buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n');
            let frameEnd = buffer.indexOf('\n\n');
            while (frameEnd >= 0) {
              handleServerEvent(buffer.slice(0, frameEnd), invalidateNotifications);
              buffer = buffer.slice(frameEnd + 2);
              frameEnd = buffer.indexOf('\n\n');
            }
          }
        } catch (error) {
          if (controller.signal.aborted) {
            return;
          }
          console.error('알림 실시간 연결이 끊겼습니다. 잠시 후 다시 연결합니다.', error);
        }

        await new Promise((resolve) => window.setTimeout(resolve, retryDelay));
        retryDelay = Math.min(retryDelay * 2, 30000);
      }
    };

    void connect();
    return () => controller.abort();
  }, [isLoggedIn, queryClient]);
}
