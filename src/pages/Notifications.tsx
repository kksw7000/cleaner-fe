import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getNotificationHome,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  notificationKeys,
} from '@/features/notification/NotificationApi';
import type { NotificationType } from '@/features/notification/types';
import { useAuthStore } from '@/store/authStore';

const notificationLabels: Record<NotificationType, string> = {
  RESERVATION_RECEIVED: '예약 접수',
  RESERVATION_APPROVED: '예약 승인',
  RESERVATION_REJECTED: '예약 거절',
  RESERVATION_CANCELLED: '예약 취소',
  RESERVATION_COMPLETED: '예약 완료',
  RESERVATION_DELETED: '예약 삭제',
};

/** 서버 LocalDateTime을 한국어 날짜·시각으로 표시합니다. */
function formatCreatedAt(value: string): string {
  const date = new Date(value);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/** 로그인 회원의 알림 보관함에서 목록·페이지 이동·읽음 처리를 제공합니다. */
export default function Notifications() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const homeQuery = useQuery({
    queryKey: notificationKeys.home,
    queryFn: getNotificationHome,
    enabled: isLoggedIn,
  });
  const notificationsQuery = useQuery({
    queryKey: notificationKeys.page(page),
    queryFn: () => getNotifications(page),
    enabled: isLoggedIn,
  });
  const invalidateNotifications = () => queryClient.invalidateQueries({ queryKey: notificationKeys.all });
  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: invalidateNotifications,
  });
  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: invalidateNotifications,
  });

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: '/notifications' }} />;
  }

  const pageData = notificationsQuery.data;

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <section className="bg-[#0B1F3A] text-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <p className="text-sm text-slate-300">내 소식</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">알림</h1>
              <p className="mt-2 text-sm text-slate-300">
                읽지 않은 알림 {homeQuery.data?.unreadCount ?? '—'}개
              </p>
            </div>
            <button
              type="button"
              onClick={() => markAllMutation.mutate()}
              disabled={!homeQuery.data?.unreadCount || markAllMutation.isPending}
              className="rounded border border-white/30 px-4 py-2 text-sm font-medium hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              모두 읽음
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {markReadMutation.isError || markAllMutation.isError ? (
          <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            읽음 상태를 변경하지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        ) : null}

        {notificationsQuery.isPending ? (
          <p role="status" className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            알림을 불러오는 중입니다.
          </p>
        ) : notificationsQuery.isError ? (
          <div role="alert" className="rounded-xl border border-red-200 bg-white p-8 text-center text-red-700">
            알림을 불러오지 못했습니다. 다시 시도해 주세요.
            <button
              type="button"
              onClick={() => void notificationsQuery.refetch()}
              className="ml-3 font-semibold underline"
            >
              다시 시도
            </button>
          </div>
        ) : pageData && (pageData.notifications.length > 0 || pageData.page > 0) ? (
          <>
            {pageData.notifications.length > 0 ? <div className="space-y-3">
              {pageData.notifications.map((notification) => {
                const isUnread = notification.readAt === null;
                return (
                  <article
                    key={notification.id}
                    className={`rounded-xl border bg-white p-5 shadow-sm ${isUnread ? 'border-blue-200' : 'border-slate-200'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold text-blue-800">
                            {notificationLabels[notification.type]}
                          </span>
                          {isUnread && <span className="h-2 w-2 rounded-full bg-blue-600" aria-label="읽지 않음" />}
                        </div>
                        <p className="mt-2 break-words text-sm leading-6 text-slate-800">{notification.message}</p>
                        <time className="mt-2 block text-xs text-slate-500" dateTime={notification.createdAt}>
                          {formatCreatedAt(notification.createdAt)}
                        </time>
                      </div>
                      {isUnread && (
                        <button
                          type="button"
                          onClick={() => markReadMutation.mutate(notification.id)}
                          disabled={markReadMutation.isPending || markAllMutation.isPending}
                          className="shrink-0 rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                          aria-label={`${notificationLabels[notification.type]} 알림 읽음 처리`}
                        >
                          읽음
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div> : <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center"><h2 className="font-semibold text-slate-800">아직 알림이 없습니다.</h2></div>}
            <nav aria-label="알림 페이지 이동" className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPage((currentPage) => Math.max(0, currentPage - 1))}
                disabled={pageData.first}
                className="rounded border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                이전
              </button>
              <span className="text-sm text-slate-500">
                {pageData.totalPages === 0 ? 0 : pageData.page + 1} / {pageData.totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((currentPage) => currentPage + 1)}
                disabled={pageData.last}
                className="rounded border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                다음
              </button>
            </nav>
          </>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
            <h2 className="font-semibold text-slate-800">아직 알림이 없습니다.</h2>
            <p className="mt-2 text-sm text-slate-500">예약 관련 소식이 도착하면 이곳에서 확인할 수 있습니다.</p>
          </div>
        )}
      </section>
    </div>
  );
}
