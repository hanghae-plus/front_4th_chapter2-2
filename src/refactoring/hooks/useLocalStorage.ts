import { useState } from 'react';

// useLocalStorage(): 로컬 스토리지를 사용하여 장바구니 상태를 저장
interface Storage<T> {
  storedItem: T;
  setCartItem: (value: T) => void;
  updateCartItem: (value: Partial<T>) => void;
}
export const useLocalStorage = <T>(key: string, initialValue: T): Storage<T> => {
  const [storedItem, setStoredItem] = useState<T>(() => {
    try {
      const product = window.localStorage.getItem(key);
      return product ? JSON.parse(product) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setCartItem = (product: T | ((prev: T) => T)) => {
    try {
      const itemToStore = product instanceof Function ? product(storedItem) : product;
      setStoredItem(itemToStore);
      window.localStorage.setItem(key, JSON.stringify(itemToStore));
    } catch (error) {
      console.log(error);
    }
  };

  const updateCartItem = (newItem: Partial<T>) => {
    const updateItem = { ...storedItem, ...newItem };
    setStoredItem(updateItem);
    window.localStorage.setItem(key, JSON.stringify(updateItem));
  };

  return { storedItem, setCartItem, updateCartItem };
};
