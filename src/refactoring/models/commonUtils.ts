import {useCallback, useEffect, useState} from "react";

// debounce를 처리해주는 함수를 개발하여, 상품 검색 컴포넌트(useSearchProduct.ts)에서 사용 중입니다.
export const debounceCallback = (callback, delay) => {
  const [timeoutId, setTimeoutId] = useState(null);
  
  
  const debouncedCallback = useCallback((...args) => {
    // 이전 타이머가 있다면 제거
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // 새로운 타이머 설정
    const newTimeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
    
    setTimeoutId(newTimeoutId);
  }, [callback, delay, timeoutId]);
  
  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);
  
  return debouncedCallback;
}