export const config = {
  mode: import.meta.env.VITE_START_MODE as string,
  isApiMockMode: import.meta.env.VITE_START_MODE === "api-mock",
  apiUrl: import.meta.env.VITE_API_URL as string,
} as const;
