export const localStorageUtil = {
  get: <T>(key: string): T | null => {
    const value = localStorage.getItem(key);
    if (!value) return null;

    return JSON.parse(value) as T;
  },

  set: <T>(key: string, value: T | null): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
};
