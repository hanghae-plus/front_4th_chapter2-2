import { CartItem } from '../../types';
import { LOCAL_STORAGE_KEY } from '../constants/localStorage';

export const useLocalStorage = () => {
  const saveToStorage = (cart: CartItem[]) => {
    const items = cart.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }));

    localStorage.setItem(LOCAL_STORAGE_KEY['CART'], JSON.stringify(items));
  };

  const getFromStorage = (): CartItem[] => {
    const items = localStorage.getItem(LOCAL_STORAGE_KEY['CART']);

    return items ? JSON.parse(items) : [];
  };

  const clearStorage = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY['CART']);
  };

  return {
    saveToStorage,
    getFromStorage,
    clearStorage,
  };
};
