import { useState } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = localStorage.getItem(key);

    return item ? JSON.parse(item) : initialValue;
  });

  const saveToStorage = (value: T | ((prevValue: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;

    setStoredValue(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  const clearStorage = () => {
    setStoredValue(initialValue);
    localStorage.removeItem(key);
  };

  return { storedValue, saveToStorage, clearStorage };
};
