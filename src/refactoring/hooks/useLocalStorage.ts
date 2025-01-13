import { useSyncExternalStore } from 'react';

type SetStateAction<T> = T | ((prevState: T) => T);

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const subscribers = new Set<() => void>();

  const subscribe = (callback: () => void) => {
    subscribers.add(callback);
    window.addEventListener('storage', callback);

    return () => {
      subscribers.delete(callback);
      window.removeEventListener('storage', callback);
    };
  };

  const getSnapshot = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const value = useSyncExternalStore(subscribe, getSnapshot);

  const setValue = (newValue: SetStateAction<T>) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));

      subscribers.forEach((callback) => callback());
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [value, setValue] as const;
};
