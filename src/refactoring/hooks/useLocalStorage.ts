export const useLocalStorage = <T>(key: string) => {
  const saveToStorage = (data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const getFromStorage = (): T | null => {
    const item = localStorage.getItem(key);

    return item ? JSON.parse(item) : null;
  };

  const clearStorage = () => {
    localStorage.removeItem(key);
  };

  return {
    saveToStorage,
    getFromStorage,
    clearStorage,
  };
};
