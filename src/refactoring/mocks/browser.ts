import { setupWorker } from "msw/browser";
import { productHandlers } from "./apis/product";
import { couponHandlers } from "./apis/coupon";
import { common } from "./common";
import { cartHandlers } from "./apis/cart";

const handlers = [
  ...productHandlers,
  ...couponHandlers,
  ...cartHandlers,
  ...common,
];

export const worker = setupWorker(...handlers);

// 실행 모드 확인
const isApiMockMode = import.meta.env.VITE_START_MODE === "api-mock";
console.log("Current mode:", import.meta.env.VITE_START_MODE);

// api-mock 모드일 때만 MSW 시작
if (isApiMockMode) {
  console.log("Starting MSW in api-mock mode");
  //   console.log("Available handlers:", handlers);
  worker
    .start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: `${window.location.origin}/mockServiceWorker.js`,
      },
    })
    .then(() => {
      console.log("MSW Worker started successfully");
    })
    .catch((error: Error) => {
      console.error("MSW 시작 실패:", error);
    });
}
