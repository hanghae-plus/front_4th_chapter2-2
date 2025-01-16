import { useState } from "react";
import { storageManager } from "../utils";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const { get, set } = storageManager<T>(key);

  const [storedValue, setStoredValue] = useState<T>(() => {
    const localValue = get();
    return localValue !== null ? localValue : initialValue;
  });

  const updateStoredValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    set(valueToStore);
  };

  return [storedValue, updateStoredValue] as const;
};
