import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { config } from "./config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// MSW 초기화
async function initMSW() {
  if (config.isApiMockMode) {
    const { worker } = await import("./mocks/browser");
    return worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: `${window.location.origin}/mockServiceWorker.js`,
      },
    });
  }
}

// MSW 초기화 후 앱 렌더링
initMSW().then(() => {
  const queryClient = new QueryClient();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>
  );
});
