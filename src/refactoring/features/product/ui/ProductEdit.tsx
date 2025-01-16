import { Input } from '../../../shared/ui/inputs';
import { useState } from 'react';
import { IProduct } from '../../../shared/types';
import { useDiscounts } from '../../../entities/discount/model/useDiscounts.ts';
import { DiscountEdit } from '../../discount/ui/DiscountEdit.tsx';

interface ProductEditProps {
  product: IProduct;
  updateProduct: (product: IProduct) => void;
  setIsEdit: (isEdit: boolean) => void;
}

export function ProductEdit({
  product,
  updateProduct,
  setIsEdit,
}: ProductEditProps) {
  const [editingProduct, setEditingProduct] = useState<IProduct>(product);
  const discountsProps = useDiscounts(product.discounts);

  const handleProductUpdate = (key: string, newValue: string | number) =>
    setEditingProduct({ ...editingProduct, [key]: newValue });

  const handleEditComplete = () => {
    updateProduct({ ...editingProduct, discounts: discountsProps.discounts });
    setIsEdit(false);
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block mb-1">상품명: </label>
        <Input
          type={'text'}
          value={editingProduct.name}
          onChange={(e) => handleProductUpdate('name', e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">가격: </label>
        <Input
          type="number"
          value={editingProduct.price}
          onChange={(e) =>
            handleProductUpdate('price', parseInt(e.target.value))
          }
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">재고: </label>
        <Input
          type="number"
          value={editingProduct.stock}
          onChange={(e) =>
            handleProductUpdate('stock', parseInt(e.target.value))
          }
        />
      </div>
      <DiscountEdit {...discountsProps} />
      <button
        onClick={handleEditComplete}
        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
      >
        수정 완료
      </button>
    </div>
  );
}
