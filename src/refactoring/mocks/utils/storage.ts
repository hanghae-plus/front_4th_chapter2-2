export const storage = {
  get: (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  clear: (key: string) => {
    localStorage.removeItem(key);
  },
  clearAll: () => {
    localStorage.clear();
  },
};
