# cleaner-fe 작업 지침

## 목표 기술 스택

- 이 디렉터리는 청소업체 프론트엔드 프로토타입을 위한 **React + Vite + TypeScript + Tailwind CSS v4** 프로젝트로 관리합니다.
- 개발 서버는 `npm run dev`로 실행하며, `package.json`의 `vite --port 3000` 스크립트로 포트를 고정합니다.
- React Router를 직접 설치해 클라이언트 라우팅을 구성합니다.
- API 통신은 axios, 서버 상태 조회·변경은 TanStack Query를 사용합니다.
- 필수 라이브러리는 `react-router-dom`, `axios`, `@tanstack/react-query`이며, 모두 `package.json`에 설치된 상태를 전제로 합니다. 설치되어 있지 않으면 코드를 작성하기 전에 먼저 알립니다.
- Vite 설정에는 React와 `@tailwindcss/vite` 플러그인, `@`에서 `src`로의 별칭을 설정합니다.
- `tailwind.config.js`와 PostCSS 설정 파일은 만들지 않습니다.

## 기본 파일 구조

- `src/main.tsx`는 `src/index.css`를 불러오고 `src/App.tsx`를 `#root`에 마운트합니다. TanStack Query의 `QueryClientProvider`도 여기서 감쌉니다.
- `src/App.tsx`는 앱의 최상위 컴포넌트입니다.
- `src/index.css`는 `@import 'tailwindcss';`를 가장 먼저 선언하고, 이어서 `@font-face`와 기본 `font-family`를 정의합니다.
- `index.html`은 Vite HTML 셸입니다.
- 폴더 역할은 아래와 같습니다.
  - `src/pages`: 라우트 단위 화면
  - `src/components`: 여러 곳에서 쓰는 공용 UI 컴포넌트
  - `src/features/<도메인>`: 도메인별 컴포넌트, 훅, API 함수 (auth, board, reservation, notification, mypage, admin)
  - `src/api`: axios 인스턴스와 인터셉터 등 공통 요청 처리
  - `src/types`: 공용 타입
- 한 도메인에서만 쓰는 코드는 `features` 안에 두고, 두 곳 이상에서 쓰면 공용 폴더로 올립니다.

## 백엔드 연동 원칙

- 모든 API 기본 주소는 `VITE_API_BASE_URL` 환경 변수로 읽습니다. `http://localhost:8080` 같은 서버 주소를 소스 코드에 하드코딩하지 않습니다.
- `.env`는 커밋하지 않고, 필요한 키 목록은 `.env.example`에 둡니다.
- 요청은 `src/api`의 axios 인스턴스로만 보내고, 컴포넌트에서 `fetch`나 `axios`를 직접 호출하지 않습니다.
- 서버 데이터 조회는 `useQuery`, 변경은 `useMutation`으로 처리하고, 서버 데이터를 `useState`로 복제하지 않습니다.
- 인증이 필요한 요청에는 Access Token을 `Authorization: Bearer <token>` 헤더로 보냅니다. axios 요청 인터셉터에서 한 번에 붙입니다.
- Refresh Token은 백엔드가 `/api/auth` 경로의 HttpOnly 쿠키로 관리하므로, 갱신·로그아웃 요청에는 `withCredentials: true`를 사용합니다.
- 401 응답은 axios 응답 인터셉터에서 `/api/auth/refresh`로 한 번만 갱신을 시도한 뒤 원래 요청을 재시도합니다. 여러 요청이 동시에 401을 받아도 갱신은 한 번만 실행되도록 합니다. 갱신도 실패하면 저장한 Access Token을 제거하고 로그인 화면으로 보냅니다.
- 프론트(3000)와 백엔드(8080)는 다른 origin입니다. 쿠키 기반 갱신을 쓰려면 백엔드 CORS 설정에서 프론트 origin과 credentials를 허용해야 합니다. 현재 `SecurityConfig`에는 CORS 설정이 없으므로, 실제 연동 전에 백엔드 설정 또는 Vite 개발 프록시를 준비합니다.
- 응답 타입은 백엔드 DTO에 맞춰 `src/types`에 정의합니다.
- 토큰을 `console.log`로 출력하거나 URL에 담지 않습니다.
- 로그인 상태는 `features/auth` 한 곳에서만 관리합니다. 관리자 화면은 라우트 가드로 ADMIN 권한을 확인하되, 최종 권한 검증은 서버가 한다는 점을 전제로 합니다.

## 구현된 백엔드 API 계약

백엔드 컨트롤러를 기준으로 아래 경로만 구현되어 있습니다. 화면을 만들 때 문서상의 예정 경로를 실제 경로로 가정하지 않습니다.

- 인증: `POST /api/auth/signup`, `/login`, `/oauth/{provider}`, `/refresh`, `/logout`, `DELETE /api/auth/withdraw`
  - 소셜 로그인은 provider별 별도 URL이 아니라 `/api/auth/oauth/{provider}`에 `{ "accessToken": "..." }`를 보냅니다.
  - 로그인·소셜 로그인·갱신은 `{ accessToken, tokenType, accessTokenExpiresIn }`을 반환합니다.
- 마이페이지: `GET/PATCH /api/mypage`, `PATCH /api/mypage/password`
  - `GET/PATCH /users/me`는 현재 백엔드에 없습니다.
- 게시글: `GET/POST /api/boards`, `GET/PATCH/DELETE /api/boards/{id}`, 댓글 CRUD(`/api/boards/{id}/comments...`)
  - 게시글 목록·상세 조회만 비로그인 접근이 가능합니다.
- 예약: `POST/GET /api/reservations`, `GET /api/reservations/availability?year=&month=`
- 알림: `/api/notifications` 및 SSE 스트림 `/api/notifications/stream`
- 관리자(ADMIN): `/admin/boards`, `/admin/members`, `/admin/reservations` 관련 관리 API
  - 관리자 API에는 `/api` 접두사가 없으며, 대시보드·서비스 관리 API는 아직 없습니다.
- 목록 API 응답이 Spring `Page` 형태(`content`, `totalElements`, `number`, `size`)인지 컨트롤러를 확인한 뒤 타입을 정의합니다.
- API 연동 기능을 추가하거나 수정하기 전에 백엔드 컨트롤러와 대조하고, 계약이 달라졌다면 이 섹션도 함께 고칩니다.

## 아직 백엔드와 맞지 않는 예정 항목

- `GET /services`, `GET /services/:category` 서비스 API는 아직 구현되어 있지 않습니다.
- `/users/me`와 관리자 대시보드·서비스 관리 API는 아직 구현되어 있지 않습니다.
- 위 기능은 목업 데이터로 화면을 구성할 수 있지만, 실연동 코드는 존재하는 API 계약과 혼동하지 않도록 별도 adapter 또는 TODO로 표시하고 백엔드 계약 확정 후 연결합니다.

## 코드 스타일

- 모든 파일은 CRLF(`\r\n`) 줄바꿈을 사용합니다. 줄바꿈만 바뀌는 불필요한 diff를 만들지 않습니다.
- TypeScript strict 모드를 유지하고 `any`는 쓰지 않습니다. 불가피하면 이유를 주석으로 남깁니다.
- 컴포넌트는 함수형 컴포넌트만 사용합니다.
- 파일명은 컴포넌트는 `PascalCase.tsx`, 훅은 `useXxx.ts`, 그 외는 `camelCase.ts`로 합니다.
- 다른 폴더의 파일은 `@/` 별칭으로 import하고, 같은 폴더의 파일은 `./`를 허용합니다. `../../` 이상의 상대경로는 쓰지 않습니다.

## 주석 작성 규칙

- 이 프로젝트는 학습을 목적으로 하므로, 코드를 처음 보는 개발자가 주석만 읽어도 실행 흐름을 따라갈 수 있어야 합니다. 일반적인 프로젝트보다 주석을 많이 작성하는 것이 의도된 규칙입니다.
- 새로 작성하거나 수정하는 코드에는 학습용 주석을 작성합니다. 주석은 코드의 목적, 처리 흐름, 그 설계가 필요한 이유를 설명합니다.
- 주석은 한국어로 작성하고, 문장은 "~합니다"로 끝나는 존댓말을 사용합니다.
- "무엇을 하는지"만 쓰지 말고 "왜 필요한지, 어떤 제약이 있는지"를 한 문장 안에 함께 담습니다.
  - 예: `/** 로그인 상태가 없으면 로그인 페이지로 보내고, 있으면 하위 라우트를 그대로 보여줍니다. */`
- 컴포넌트, 커스텀 훅, 타입, 모든 함수 위에는 `/** */` 한 줄 주석을 작성합니다. 한 줄로 부족하면 2~3줄까지 허용하되 장황하게 쓰지 않습니다.
  - 컴포넌트: 어떤 화면인지, 어떤 훅과 API를 사용하는지
  - 커스텀 훅: 어떤 상태와 로직을 묶는지, 반환값의 의미
  - API 함수: 어떤 엔드포인트를 호출하는지, 인증이 필요한지
  - 타입: 백엔드 DTO 중 무엇과 대응되는지
- 함수 내부가 여러 단계로 나뉘면 단계마다 `//` 인라인 주석으로 처리 순서를 설명합니다.
  - 예: `// 1. 입력값 검증 → 2. 로그인 API 호출 → 3. 토큰 저장 → 4. 이전 페이지로 이동`
- 인증/권한 확인, 에러 처리, 상태 변경, 중요한 조건 분기에는 그 분기가 필요한 이유를 인라인 주석으로 씁니다.
- 새 라이브러리, 프레임워크 기능, 낯선 문법(`useEffect` 의존성 배열, `useMutation`, axios 인터셉터 등)을 처음 도입할 때는 사용 이유와 역할을 주석으로 설명합니다.
- 코드 내용을 그대로 반복하거나 이름만 봐도 알 수 있는 단순한 내용(import문, 단순 변수 선언, 단순한 props 전달)에는 주석을 달지 않습니다.
- 기존 코드의 주석 스타일과 의미는 유지하고, 코드를 수정해 내용이 달라졌다면 주석도 함께 고칩니다.

## 스타일링 (Tailwind v4)

- 컴포넌트 스타일은 JSX 안의 Tailwind 유틸리티 클래스로 작성합니다.
- 색상, 폰트 같은 테마 값은 `src/index.css`의 `@theme`에 정의하고, 컴포넌트에 색상 값을 직접 쓰지 않습니다.
- 반응형은 모바일 우선(`sm:`, `md:` 순서)으로 작성합니다.

## UI/접근성

- 클릭 가능한 요소는 `div`가 아니라 `button`/`a`를 씁니다.
- 이미지에는 `alt`, 입력창에는 `label`을 답니다.
- 로딩, 에러, 빈 상태 화면을 항상 함께 만듭니다.

## 작업 시 주의

- 위 필수 라이브러리 외의 새 라이브러리는 설치 전에 먼저 물어봅니다.
- 요청하지 않은 파일 이동, 이름 변경, 대규모 리팩터링은 하지 않습니다.
- 비밀 키, 토큰, 개인정보를 코드에 하드코딩하지 않습니다.
- 작업 후 `npm run build`와 타입 체크가 통과해야 합니다.
- PR의 대상 브랜치는 `dev`입니다.