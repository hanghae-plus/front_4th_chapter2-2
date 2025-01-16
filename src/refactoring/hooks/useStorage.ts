//* storage 생성성
export const createStorage = (key: string, storage = window.localStorage) => {
  const get = () => {
    const item = storage.getItem(key);
    return item ? JSON.parse(item) : null;
  };
  const set = (value: JSON) => storage.setItem(key, JSON.stringify(value));
  const reset = () => storage.removeItem(key);

  return { get, set, reset };
};
