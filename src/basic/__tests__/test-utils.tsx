import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";

// 테스트용 QueryClient 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// 테스트용 wrapper 컴포넌트
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

// 커스텀 render 함수
export const customRender = (ui: React.ReactElement) => {
  return render(ui, { wrapper: TestWrapper });
};
