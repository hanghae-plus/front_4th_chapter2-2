import { useEffect, useState } from "react";

interface UseLocalStorageOptions<T> {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
}

const defaultSerializer = <T>(value: T): string => JSON.stringify(value);
const defaultDeserializer = <T>(value: string): T => JSON.parse(value);

/**
 * 로컬 스토리지 훅
 * @param key 스토리지 키
 * @param initialValue 초기 값
 * @param options 옵션
 * @returns 저장된 값, 값 설정 함수
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
) {
  const { serializer = defaultSerializer, deserializer = defaultDeserializer } =
    options;

  const getInitialValue = (): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? deserializer(item) : initialValue;
    } catch (error) {
      console.error(`${key} 로컬 스토리지 초기화 실패`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(getInitialValue());

  const setValue = (value: T | ((prevValue: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, serializer(valueToStore));
    } catch (error) {
      console.error(`${key} 로컬 스토리지 설정 실패`, error);
    }
  };

  // 다른 탭/창에서의 변경 감지
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        setStoredValue(deserializer(event.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, deserializer]);

  return [storedValue, setValue] as const;
}
