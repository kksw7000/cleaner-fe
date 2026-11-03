import CategoryPage from './CategoryPage';

/** 가전 청소 서비스 URL을 공통 서비스 화면에 연결합니다. */
export default function Appliance() {
  return <CategoryPage categoryOverride="APPLIANCE" />;
}
