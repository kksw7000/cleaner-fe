import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "@/App";
import "@/index.css";

/** QueryClient는 서버 데이터의 캐시와 재요청 규칙을 한곳에서 관리해 화면마다 같은 요청을 중복하지 않게 합니다. */
const queryClient = new QueryClient();

/** App 내부에서 BrowserRouter를 구성하고, 여기서는 모든 페이지가 서버 상태 캐시를 공유하도록 공급자를 감쌉니다. */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
