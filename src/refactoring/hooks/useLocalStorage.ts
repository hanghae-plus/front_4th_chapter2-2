import { useState } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const storageValue = localStorage.getItem(key);

  const parsedValue = storageValue ? JSON.parse(storageValue) : initialValue;

  const [storageItem, setStoredData] = useState<T>(parsedValue);

  const setItem = (value: T) => {
    setStoredData(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  const updateItem = (newValue: Partial<T>) => {
    const updatedValue = { ...storageItem, ...newValue };
    setItem(updatedValue);
  };

  return { storageItem, updateItem, setItem };
};
