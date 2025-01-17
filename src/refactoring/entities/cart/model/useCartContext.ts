import { useContext } from 'react';
import { CartContext } from '../../../pages/cart/ui/CartContextProvider.tsx';

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a cart');
  }
  return context;
};
