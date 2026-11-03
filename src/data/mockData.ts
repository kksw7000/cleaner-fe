export type ServiceCategory =
  | 'MATTRESS'
  | 'SOFA_CARPET'
  | 'MOVE_IN'
  | 'APPLIANCE'
  | 'CONSTRUCTION'
  | 'COMMERCIAL'
  | 'WAX_COATING'
  | 'REGULAR_CLEANING'
  | 'ESTATE_CLEANING';

export const categoryLabels: Record<ServiceCategory, string> = {
  MATTRESS: '매트리스',
  SOFA_CARPET: '소파·카페트',
  MOVE_IN: '입주 청소',
  APPLIANCE: '에어컨·세탁기',
  CONSTRUCTION: '준공 청소',
  COMMERCIAL: '상업 공간 청소',
  WAX_COATING: '왁스 코팅',
  REGULAR_CLEANING: '정기 청소',
  ESTATE_CLEANING: '유품 정리',
};

export const categoryIcons: Record<ServiceCategory, string> = {
  MATTRESS: '🛏',
  SOFA_CARPET: '🛋',
  MOVE_IN: '📦',
  APPLIANCE: '🌀',
  CONSTRUCTION: '🏗',
  COMMERCIAL: '🏢',
  WAX_COATING: '✨',
  REGULAR_CLEANING: '🧹',
  ESTATE_CLEANING: '🗂',
};

export interface ServiceProduct {
  id: number;
  name: string;
  category: ServiceCategory;
  description: string;
  price: number;
  imageId: string;
}

export const services: ServiceProduct[] = [
  { id: 1, name: 'Deep Mattress Sanitization', category: 'MATTRESS', description: 'UV sterilization and deep steam cleaning to eliminate dust mites, allergens, and bacteria from your mattress.', price: 89000, imageId: 'photo-1631049307264-da0ec9d70304' },
  { id: 2, name: 'Mattress Stain Removal', category: 'MATTRESS', description: 'Professional stain treatment for stubborn marks and odors, restoring your mattress to like-new condition.', price: 59000, imageId: 'photo-1505693416388-ac5ce068fe85' },
  { id: 3, name: 'Sofa Steam Cleaning', category: 'SOFA_CARPET', description: 'High-pressure steam cleaning for fabric sofas, removing embedded dirt, pet hair, and allergens.', price: 120000, imageId: 'photo-1555041469-a586c61ea9bc' },
  { id: 4, name: 'Carpet Deep Clean', category: 'SOFA_CARPET', description: 'Hot water extraction method for wall-to-wall carpets, leaving them fresh and odor-free.', price: 95000, imageId: 'photo-1558618666-fcd25c85cd64' },
  { id: 5, name: 'Move-in Full Clean', category: 'MOVE_IN', description: 'Comprehensive cleaning package before moving in — every surface, fixture, and corner spotless.', price: 250000, imageId: 'photo-1558618666-fcd25c85cd64' },
  { id: 6, name: 'Move-out Clean', category: 'MOVE_IN', description: 'Security deposit-safe deep clean ensuring your previous home is left in perfect condition.', price: 220000, imageId: 'photo-1527515637462-cff94aca208b' },
  { id: 7, name: 'Air Conditioner Cleaning', category: 'APPLIANCE', description: 'Full disassembly, antibacterial wash, and reassembly for split and wall-mounted AC units.', price: 75000, imageId: 'photo-1630427804340-0b8524e85f25' },
  { id: 8, name: 'Washing Machine Drum Clean', category: 'APPLIANCE', description: 'Inside-out deep clean removing mold, scale, and detergent residue from drum and seals.', price: 65000, imageId: 'photo-1626806787461-102c1bfaaea1' },
  { id: 9, name: 'Post-construction Cleanup', category: 'CONSTRUCTION', description: 'Specialized removal of construction dust, paint splatter, adhesive residue, and debris.', price: 350000, imageId: 'photo-1504307651254-35680f356dfd' },
  { id: 10, name: 'Office Space Cleaning', category: 'COMMERCIAL', description: 'Regular or one-time cleaning for offices, meeting rooms, and reception areas.', price: 180000, imageId: 'photo-1497366216548-37526070297c' },
  { id: 11, name: 'Floor Wax & Polish', category: 'WAX_COATING', description: 'Professional wax coating application for hardwood and tile floors, restoring gloss and protection.', price: 200000, imageId: 'photo-1581578731548-c64695cc6952' },
  { id: 12, name: 'Weekly Home Cleaning', category: 'REGULAR_CLEANING', description: 'Scheduled weekly cleaning covering all living areas, kitchen, and bathrooms.', price: 80000, imageId: 'photo-1563453392212-326f5e854473' },
  { id: 13, name: 'Belongings Organization', category: 'ESTATE_CLEANING', description: 'Professional organization and sorting of household belongings, ideal for downsizing or estate situations.', price: 150000, imageId: 'photo-1614771637369-ed94441a651c' },
];

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED';

export interface Reservation {
  id: number;
  serviceId: number;
  serviceName: string;
  reservationDate: string;
  address: string;
  status: ReservationStatus;
  memo: string;
  createdAt: string;
}

export const mockReservations: Reservation[] = [
  { id: 1, serviceId: 1, serviceName: 'Deep Mattress Sanitization', reservationDate: '2026-09-25 10:00', address: '123 Maple Street, Apt 4B, Seoul', status: 'CONFIRMED', memo: 'King size, please bring extra covers', createdAt: '2026-09-17' },
  { id: 2, serviceId: 7, serviceName: 'Air Conditioner Cleaning', reservationDate: '2026-10-02 14:00', address: '123 Maple Street, Apt 4B, Seoul', status: 'PENDING', memo: '2 wall units', createdAt: '2026-09-16' },
  { id: 3, serviceId: 12, serviceName: 'Weekly Home Cleaning', reservationDate: '2026-09-10 09:00', address: '123 Maple Street, Apt 4B, Seoul', status: 'COMPLETED', memo: '', createdAt: '2026-09-05' },
];

export interface BoardPost {
  id: number;
  title: string;
  content: string;
  writer: string;
  viewCount: number;
  createdAt: string;
}

export const mockPosts: BoardPost[] = [
  { id: 1, title: '소파 전문 청소는 얼마나 자주 해야 하나요?', content: '반려견 두 마리와 패브릭 소파를 함께 사용하고 있어요. 지난달에 청소를 맡겼는데 정말 만족스러워서 경험을 나누고, 다른 분들은 얼마나 자주 청소하시는지 궁금합니다.\n\n고온 스팀 방식으로 청소해 주셨고 소파가 새것처럼 깨끗해졌어요. 반려동물 냄새도 사라졌습니다!', writer: '소피', viewCount: 142, createdAt: '2026-09-15' },
  { id: 2, title: '입주 청소, 비용이 아깝지 않았어요', content: '새 아파트로 이사하면서 입주 청소를 예약했어요. 약속한 시간에 오셔서 네 시간 동안 구석구석 꼼꼼하게 청소해 주셨습니다.\n\n이전 거주자가 있던 집으로 이사하신다면 적극 추천합니다.', writer: '마크', viewCount: 98, createdAt: '2026-09-12' },
  { id: 3, title: '전문 청소 후 깨끗한 집을 유지하는 방법', content: '정기 청소를 시작한 뒤 청소 방문 사이에도 집을 깔끔하게 유지하려고 매일 작은 습관을 실천하고 있어요. 제가 추천하는 다섯 가지 방법을 소개합니다.', writer: '제나', viewCount: 213, createdAt: '2026-09-10' },
  { id: 4, title: '에어컨 청소 전후, 확실히 달라졌어요', content: '몇 달 동안 에어컨에서 퀴퀴한 냄새가 났는데 청소 후 공기가 훨씬 상쾌해졌어요. 작동 소음도 줄어들어 정말 만족합니다.', writer: '크리스', viewCount: 87, createdAt: '2026-09-08' },
  { id: 5, title: '청소하는 동안 집에 있어야 하나요?', content: '평일 오전 9시부터 오후 5시까지 일하고 있어서 집에 없어도 청소가 가능한지 궁금합니다. 비밀번호 보관함을 이용해 서비스를 받아보신 분이 계실까요?', writer: '알렉스', viewCount: 55, createdAt: '2026-09-06' },
];

export interface AdminUser {
  id: number;
  email: string;
  nickname: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  provider: string;
  createdAt: string;
}

export const mockUsers: AdminUser[] = [
  { id: 1, email: 'sophie.k@email.com', nickname: 'Sophie K.', phone: '010-1234-5678', role: 'USER', provider: 'LOCAL', createdAt: '2026-08-10' },
  { id: 2, email: 'mark.t@email.com', nickname: 'Mark T.', phone: '010-2345-6789', role: 'USER', provider: 'GOOGLE', createdAt: '2026-08-15' },
  { id: 3, email: 'jenna.l@email.com', nickname: 'Jenna L.', phone: '010-3456-7890', role: 'USER', provider: 'LOCAL', createdAt: '2026-08-20' },
  { id: 4, email: 'chris.w@email.com', nickname: 'Chris W.', phone: '010-4567-8901', role: 'USER', provider: 'KAKAO', createdAt: '2026-09-01' },
  { id: 5, email: 'admin@cleaner.com', nickname: 'Admin', phone: '010-0000-0000', role: 'ADMIN', provider: 'LOCAL', createdAt: '2026-07-01' },
];

export const adminReservations = [
  { id: 1, userName: 'Sophie K.', email: 'sophie.k@email.com', serviceName: 'Deep Mattress Sanitization', reservationDate: '2026-09-25 10:00', address: '123 Maple St', status: 'CONFIRMED' as ReservationStatus, createdAt: '2026-09-17' },
  { id: 2, userName: 'Mark T.', email: 'mark.t@email.com', serviceName: 'Air Conditioner Cleaning', reservationDate: '2026-10-02 14:00', address: '456 Oak Ave', status: 'PENDING' as ReservationStatus, createdAt: '2026-09-16' },
  { id: 3, userName: 'Jenna L.', email: 'jenna.l@email.com', serviceName: 'Weekly Home Cleaning', reservationDate: '2026-09-10 09:00', address: '789 Pine Rd', status: 'COMPLETED' as ReservationStatus, createdAt: '2026-09-05' },
  { id: 4, userName: 'Chris W.', email: 'chris.w@email.com', serviceName: 'Sofa Steam Cleaning', reservationDate: '2026-09-28 11:00', address: '321 Elm St', status: 'PENDING' as ReservationStatus, createdAt: '2026-09-14' },
];
