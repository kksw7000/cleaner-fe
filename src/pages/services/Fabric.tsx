import CategoryPage from './CategoryPage';

/** 패브릭 서비스 URL을 공통 서비스 화면에 연결합니다. */
export default function Fabric() {
  return <CategoryPage categoryOverride="FABRIC" />;
}
