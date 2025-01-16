import { useState } from 'react';

interface Storage<T> {
  item: T;
  setItem: (value: T) => void;
  updateItem: (value: Partial<T>) => void;
}

interface StorageStrategy<T> {
  get: () => T;
  set: (value: T) => void;
}

const createLocalStorageStrategy = <T>(key: string, initialValue: T): StorageStrategy<T> => {
  return {
    get: () => {
      try {
        const storageValue = localStorage.getItem(key);
        return storageValue ? JSON.parse(storageValue) : initialValue;
      } catch {
        return initialValue;
      }
    },
    set: (value: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    },
  };
};

const createStateStorageStrategy = <T>(initialValue: T): StorageStrategy<T> => {
  return {
    get: () => initialValue,
    set: () => {},
  };
};

export const useStorage = <T>(key: string, initialValue: T): Storage<T> => {
  const environment = import.meta.env.VITE_STORAGE_TYPE;
  const storageType =
    environment === 'local' ? createLocalStorageStrategy(key, initialValue) : createStateStorageStrategy(initialValue);

  const [item, setStoredData] = useState<T>(() => storageType.get());

  const setItem = (value: T) => {
    setStoredData(() => value);
    storageType.set(value);
  };

  const updateItem = (newValue: Partial<T>) => {
    const updatedValue = { ...item, ...newValue };
    setItem(updatedValue);
  };

  return { item, setItem, updateItem };
};
