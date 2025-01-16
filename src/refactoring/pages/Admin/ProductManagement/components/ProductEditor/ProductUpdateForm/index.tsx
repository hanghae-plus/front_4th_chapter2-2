import { DiscountDetails } from '@/refactoring/pages/Admin/ProductManagement/components/ProductEditor/ProductUpdateForm/DiscountDetails';
import { useProductForm } from '@/refactoring/pages/Admin/ProductManagement/components/ProductEditor/ProductUpdateForm/hooks/useProductForm';
import type { Product } from '@/types';

interface ProductUpdateFormProps {
  initProduct: Product;
  onProductUpdate: (updatedProduct: Product) => void;
  onEditComplete: () => void;
}

export const ProductUpdateForm = ({ initProduct, onProductUpdate, onEditComplete }: ProductUpdateFormProps) => {
  const { editingProduct, updateName, updatePrice, updateStock, updateDiscounts } = useProductForm({ initProduct });

  const handleEditComplete = () => {
    onProductUpdate(editingProduct);
    onEditComplete();
  };

  return (
    <div>
      <div className="mb-4">
        <label className="mb-1 block">상품명: </label>
        <input
          type="text"
          value={editingProduct.name}
          onChange={e => updateName(e.target.value)}
          className="w-full rounded border p-2"
        />
      </div>
      <div className="mb-4">
        <label className="mb-1 block">가격: </label>
        <input
          type="number"
          value={editingProduct.price}
          onChange={e => updatePrice(parseInt(e.target.value))}
          className="w-full rounded border p-2"
        />
      </div>
      <div className="mb-4">
        <label className="mb-1 block">재고: </label>
        <input
          type="number"
          value={editingProduct.stock}
          onChange={e => updateStock(parseInt(e.target.value))}
          className="w-full rounded border p-2"
        />
      </div>

      <DiscountDetails discounts={editingProduct.discounts} onDiscountsUpdate={updateDiscounts} />

      <button
        onClick={handleEditComplete}
        className="mt-2 rounded bg-green-500 px-2 py-1 text-white hover:bg-green-600"
      >
        수정 완료
      </button>
    </div>
  );
};
