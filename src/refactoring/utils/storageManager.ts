export const storageManager = <T>(
  key: string,
  storage = window.localStorage,
) => {
  const get = (): T | null => {
    const item = storage.getItem(key);
    return item ? JSON.parse(item) : null;
  };

  const set = (value: T): void => {
    storage.setItem(key, JSON.stringify(value));
  };

  const reset = (): void => {
    storage.removeItem(key);
  };

  return { get, set, reset };
};
