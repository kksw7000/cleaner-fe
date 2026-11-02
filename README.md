# cleaner-fe

청소업체 서비스의 React + Vite + TypeScript 프론트엔드입니다.

## 시작하기

```bash
npm install
npm run dev
```

개발 서버는 `http://localhost:3000`에서 실행됩니다.

## 환경 변수

프로젝트 루트에 `.env.local` 파일을 만들고 백엔드 API 기본 주소를 설정합니다.

```env
VITE_API_BASE_URL=http://localhost:8080
```

API 요청 코드는 이 환경 변수를 통해 주소를 읽어야 하며, 서버 주소를 코드에 직접 작성하지 않습니다.

## 검증

```bash
npm run build
```

이 명령은 TypeScript 검사 후 Vite 프로덕션 번들을 `dist`에 생성합니다.
