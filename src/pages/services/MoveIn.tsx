import CategoryPage from './CategoryPage';

/** 입주 청소 서비스 URL을 공통 서비스 화면에 연결합니다. */
export default function MoveIn() {
  return <CategoryPage categoryOverride="MOVE_IN" />;
}
