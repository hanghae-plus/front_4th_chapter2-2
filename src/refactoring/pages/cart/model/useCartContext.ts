import { useContext } from 'react';
import { CartContext } from '../../providers/CartContextProvider.tsx';

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a cart');
  }
  return context;
};
