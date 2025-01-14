import { useState } from 'react';

// useLocalStorage(): 로컬 스토리지를 사용하여 장바구니 상태를 저장
export const useLocalStorage = (key: string, initialValue: string) => {
  const [storedItem, setStoredItem] = useState(() => {
    try {
      const product = window.localStorage.getItem(key);
      return product ? JSON.parse(product) : initialValue;
    } catch (error) {
      console.log(error);
    }
  });

  const setCartItem = (product: unknown) => {
    try {
      const itemToStore = product instanceof Function ? product(storedItem) : product;
      setStoredItem(itemToStore);
      window.localStorage.setItem(key, JSON.stringify(itemToStore));
    } catch (error) {
      console.log(error);
    }
  };

  const removeCartItem = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredItem(undefined);
    } catch (error) {
      console.log(error);
    }
  };

  return [storedItem, setCartItem, removeCartItem];
};
