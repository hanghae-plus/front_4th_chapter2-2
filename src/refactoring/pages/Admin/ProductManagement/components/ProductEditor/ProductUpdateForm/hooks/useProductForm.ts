import { useForm } from '@/refactoring/hooks/useForm';
import type { Discount, Product } from '@/types';

interface UseProductFormProps {
  initProduct: Product;
}

export const useProductForm = ({ initProduct }: UseProductFormProps) => {
  const { value: editingProduct, updateValue } = useForm<Product>(initProduct);

  const updateName = (name: string) => {
    updateValue('name', name);
  };

  const updatePrice = (price: number) => {
    updateValue('price', price);
  };

  const updateStock = (stock: number) => {
    updateValue('stock', stock);
  };

  const updateDiscounts = (newDiscounts: Discount[]) => {
    updateValue('discounts', newDiscounts);
  };

  return {
    editingProduct,
    updateName,
    updatePrice,
    updateStock,
    updateDiscounts
  };
};
