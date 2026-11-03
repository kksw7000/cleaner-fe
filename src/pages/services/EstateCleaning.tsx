import CategoryPage from './CategoryPage';

/** 유품 정리 서비스 URL을 공통 서비스 화면에 연결합니다. */
export default function EstateCleaning() {
  return <CategoryPage categoryOverride="ESTATE_CLEANING" />;
}
