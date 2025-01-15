import {useCallback, useEffect, useState} from "react";

export const debounce = (value, delay) => {
  const [debounceValue, setDebounceValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    });
    
    return () => {
      clearTimeout(timer);
    }
  }, [value, delay]);
  
  return debounceValue;
}

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