import { IDiscount, IProduct } from '../../../shared/types';
import { createContext } from 'react';
import { useEidtingProduct } from '../model/useEidtingProduct.ts';

export interface IEditingProductContextProvider {
  editingProduct: IProduct;
  handleProductUpdate: (key: string, newValue: string | number) => void;
  handleRemoveDiscount: (index: number) => void;
  handleAddProductDiscount: (newDiscount: IDiscount) => void;
}

export const EditingProductContext = createContext<
  IEditingProductContextProvider | undefined
>(undefined);

export function EditingProductProvider({
  editProduct,
  children,
}: {
  editProduct: IProduct;
  children: React.ReactNode;
}) {
  const editingProductContextValue = useEidtingProduct(editProduct);

  return (
    <EditingProductContext.Provider value={editingProductContextValue}>
      {children}
    </EditingProductContext.Provider>
  );
}
