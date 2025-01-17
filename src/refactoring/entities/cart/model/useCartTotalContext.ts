import { useContext } from 'react';
import { CartTotalContext } from '../../../pages/cart/ui/CartTotalContextProvider.tsx';

export const useCartTotalContext = () => {
  const context = useContext(CartTotalContext);
  if (!context) {
    throw new Error(
      'useCartTotalContext must be used within CartTotalContextProvider',
    );
  }
  return context;
};
