import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { config } from "./config";

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
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
