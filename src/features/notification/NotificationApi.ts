import { apiClient } from '@/api/ApiClient';
import type { Notification, NotificationHome, NotificationPage } from '@/features/notification/types';

const pageSize = 10;

/** 캐시를 인증된 회원 알림 영역으로 묶어 로그인 전환 시 안전하게 무효화합니다. */
export const notificationKeys = {
  all: ['notifications'] as const,
  home: ['notifications', 'home'] as const,
  page: (page: number) => ['notifications', 'page', page, pageSize] as const,
  unreadCount: ['notifications', 'unread-count'] as const,
};

/** 헤더 미리보기와 전체 미읽음 개수를 조회합니다. */
export async function getNotificationHome(): Promise<NotificationHome> {
  const { data } = await apiClient.get<NotificationHome>('/api/notifications/home');
  return data;
}

/** 로그인 회원의 알림을 최신순으로 10개씩 조회합니다. */
export async function getNotifications(page: number): Promise<NotificationPage> {
  const { data } = await apiClient.get<NotificationPage>('/api/notifications', {
    params: { page, size: pageSize },
  });
  return data;
}

/** 헤더 배지에 사용할 전체 미읽음 개수를 조회합니다. */
export async function getUnreadNotificationCount(): Promise<number> {
  const { data } = await apiClient.get<number>('/api/notifications/unread-count');
  return data;
}

/** 현재 회원 소유의 알림 한 건을 읽음 처리합니다. */
export async function markNotificationAsRead(id: number): Promise<Notification> {
  const { data } = await apiClient.patch<Notification>(`/api/notifications/${id}/read`);
  return data;
}

/** 현재 회원의 미읽음 알림을 모두 읽음 처리하고 변경 건수를 반환합니다. */
export async function markAllNotificationsAsRead(): Promise<number> {
  const { data } = await apiClient.patch<number>('/api/notifications/read-all');
  return data;
}
