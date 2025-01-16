import { http } from "msw";

export const common = [
  // chrome-extension 요청 처리
  http.get("chrome-extension://*", () => {
    return;
  }),

  // Vite 개발 서버 관련 요청 처리
  http.get("/src/refactoring/*", () => {
    return;
  }),
  http.get("/node_modules/*", () => {
    return;
  }),

  // 기타 정적 파일 요청 처리
  http.get("/assets/*", () => {
    return;
  }),
  http.get("/public/*", () => {
    return;
  }),

  // 마지막으로 매칭되지 않은 모든 요청 처리
  http.get("*", () => {
    return;
  }),
];
