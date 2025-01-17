import { useContext } from 'react';
import { ProductContext } from '../../../app/providers';

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext must be within a ProductProvider');
  }
  return context;
};
