import { useState } from 'react';

type UseLocalStorageReturn<T> = [T, (value: T | ((prev: T) => T)) => void];

export function useLocalStorage<T>(key: string, initialValue: T): UseLocalStorageReturn<T> {
  const ENV_TEST_TYPE = process.env.NODE_ENV === 'test';

  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined' || ENV_TEST_TYPE) return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setStorageValue = (value: T | ((prev: T) => T)) => {
    try {
      setValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        return newValue;
      });
    } catch (error) {
      console.log(error);
    }
  };

  return [value, setStorageValue];
}
