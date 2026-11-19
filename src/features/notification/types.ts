/** 백엔드 NotificationType enum과 동일한 알림 분류입니다. */
export type NotificationType =
  | 'RESERVATION_RECEIVED'
  | 'RESERVATION_APPROVED'
  | 'RESERVATION_REJECTED'
  | 'RESERVATION_CANCELLED'
  | 'RESERVATION_COMPLETED'
  | 'RESERVATION_DELETED';

/** 목록·홈·읽음 처리·SSE에서 공유하는 백엔드 알림 DTO입니다. */
export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  reservationId: number | null;
  createdAt: string;
  readAt: string | null;
}

/** 홈 헤더 미리보기와 전체 미읽음 배지 응답입니다. */
export interface NotificationHome {
  notifications: Notification[];
  unreadCount: number;
}

/** 알림 보관 목록과 Spring 페이지 정보를 반환하는 응답입니다. */
export interface NotificationPage {
  notifications: Notification[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
