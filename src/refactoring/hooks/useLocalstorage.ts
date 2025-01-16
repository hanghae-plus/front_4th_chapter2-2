import { useState, useEffect } from 'react';

interface UseLocalStorageProps<T> {
  key: string;
  initialValue: T;
}

export const useLocalStorage = <T>({ key, initialValue }: UseLocalStorageProps<T>): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key: ${key}, error: ${error}`);
      alert(`로컬스토리지를 읽는 중 문제가 발생했습니다. 문제가 지속될 경우 관리자에게 문의해주세요.`);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key: ${key}, error: ${error}`);
      alert(`로컬스토리지를 사용하는 중 문제가 발생했습니다. 문제가 지속될 경우 관리자에게 문의해주세요.`);
    }
  }, [key, storedValue]);

  const setValue = (value: T) => {
    setStoredValue(value);
  };

  return [storedValue, setValue];
};
