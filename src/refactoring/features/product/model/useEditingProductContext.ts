import { useContext } from 'react';
import { EditingProductContext } from '../ui/EditingProductContextProvider.tsx';

export const useEditingProductContext = () => {
  const context = useContext(EditingProductContext);
  if (!context) {
    throw new Error(
      'useEditingProductContext must be used within useEditingProductContextProvider',
    );
  }
  return context;
};
