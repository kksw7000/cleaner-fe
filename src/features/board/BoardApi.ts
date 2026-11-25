import { apiClient } from '@/api/ApiClient';

/** 백엔드 게시판 DTO와 동일한 목록 및 상세 응답 형식입니다. */
export interface BoardSummary {
  id: number;
  title: string;
  notice: boolean;
  authorId: number;
  authorName: string;
  viewCount: number;
  createdAt: string;
}

export interface BoardComment {
  id: number;
  content: string;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardDetail extends BoardSummary {
  content: string;
  updatedAt: string;
  comments: BoardComment[];
}

export interface BoardPage {
  content: BoardSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/** 비로그인 방문자의 브라우저 ID를 로컬 저장소에 유지해 새로고침 후에도 같은 방문자로 식별합니다. */
function getVisitorId(): string {
  const storageKey = 'boardVisitorId';
  const savedId = localStorage.getItem(storageKey);
  if (savedId && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(savedId)) {
    return savedId;
  }

  const visitorId = crypto.randomUUID();
  localStorage.setItem(storageKey, visitorId);
  return visitorId;
}

/** 게시글 페이지를 검색어와 함께 공개 API에서 조회합니다. */
export async function getBoards(page: number, keyword: string): Promise<BoardPage> {
  const { data } = await apiClient.get<BoardPage>('/api/boards', {
    params: { page, size: 10, ...(keyword ? { keyword } : {}) },
  });
  return data;
}

/** 게시글 상세와 해당 게시글의 댓글을 함께 조회합니다. */
export async function getBoard(id: number): Promise<BoardDetail> {
  const { data } = await apiClient.get<BoardDetail>(`/api/boards/${id}`, {
    headers: { 'X-Visitor-Id': getVisitorId() },
  });
  return data;
}

/** 인증된 회원의 게시글을 생성합니다. */
export async function createBoard(input: { title: string; content: string }): Promise<BoardDetail> {
  const { data } = await apiClient.post<BoardDetail>('/api/boards', { ...input, notice: false });
  return data;
}

/** 작성자가 게시글의 제목과 내용을 수정합니다. */
export async function updateBoard(id: number, input: { title: string; content: string; notice?: boolean }): Promise<BoardDetail> {
  const { data } = await apiClient.patch<BoardDetail>(`/api/boards/${id}`, { ...input, notice: input.notice ?? false });
  return data;
}

/** 작성자 또는 관리자가 게시글을 삭제합니다. */
export async function deleteBoard(id: number): Promise<void> {
  await apiClient.delete(`/api/boards/${id}`);
}

/** 관리자 게시글 관리 화면에서 페이지와 검색어에 맞는 게시글을 조회합니다. */
export async function getAdminBoards(page: number, keyword: string): Promise<BoardPage> {
  const { data } = await apiClient.get<BoardPage>('/admin/boards', {
    params: { page, size: 10, ...(keyword ? { keyword } : {}) },
  });
  return data;
}

/** 관리자가 게시글을 삭제합니다. */
export async function deleteAdminBoard(id: number): Promise<void> {
  await apiClient.delete(`/admin/boards/${id}`);
}

/** 인증된 회원이 게시글에 댓글을 등록합니다. */
export async function createComment(boardId: number, content: string): Promise<BoardComment> {
  const { data } = await apiClient.post<BoardComment>(`/api/boards/${boardId}/comments`, { content });
  return data;
}

/** 댓글 작성자가 댓글 내용을 수정합니다. */
export async function updateComment(boardId: number, commentId: number, content: string): Promise<BoardComment> {
  const { data } = await apiClient.patch<BoardComment>(`/api/boards/${boardId}/comments/${commentId}`, { content });
  return data;
}

/** 댓글 작성자 또는 관리자가 댓글을 삭제합니다. */
export async function deleteComment(boardId: number, commentId: number): Promise<void> {
  await apiClient.delete(`/api/boards/${boardId}/comments/${commentId}`);
}

/** 백엔드 LocalDateTime을 게시판에서 읽기 쉬운 한국어 날짜로 표시합니다. */
export function formatBoardDate(value: string): string {
  return new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}
