import CategoryPage from './CategoryPage';

/** 정기 청소 서비스 URL을 공통 서비스 화면에 연결합니다. */
export default function RegularCleaning() {
  return <CategoryPage categoryOverride="REGULAR_CLEANING" />;
}
