import { useState, useEffect, useCallback } from 'react';

/**
 * 로컬스토리지를 활용한 상태 관리 커스텀 훅
 *
 * @template T - 저장할 데이터 타입
 * @param {string} key - 로컬스토리지 키
 * @param {T} initialValue - 초기값
 * @param {(data: any) => data is T} validateFn - 데이터 유효성 검사 함수
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]} - 상태와 상태 업데이트 함수
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  validateFn: (data: unknown) => data is T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const getStoredValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // 유효한 데이터만 반환
        return validateFn(parsed) ? parsed : initialValue;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // 상태(state)를 로컬스토리지에서 가져온 값으로 초기화
  const [state, setState] = useState<T>(getStoredValue);

  // 로컬스토리지에 상태를 저장하는 함수
  const setStoredValue = useCallback(
    (newState: T) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(newState));
      } catch (error) {
        console.error(`Error saving to localStorage key "${key}":`, error);
      }
    },
    [key],
  );

  useEffect(() => {
    setStoredValue(state);
  }, [key, state, setStoredValue]);

  return [state, setState];
};
