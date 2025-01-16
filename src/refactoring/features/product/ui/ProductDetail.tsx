import { useState } from 'react';
import { IProduct } from '../../../shared/types';
import { useProductContext } from '../../../entities/product/model';
import { ProductEdit } from './ProductEdit.tsx';
import { EditingProductProvider } from './EditingProductContextProvider.tsx';

interface ProductDetailProps {
  productId: string;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const { findProduct, updateProduct } = useProductContext();
  const product = findProduct(productId) as IProduct;

  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="mt-2">
      {isEdit ? (
        <EditingProductProvider editProduct={product}>
          <ProductEdit updateProduct={updateProduct} setIsEdit={setIsEdit} />
        </EditingProductProvider>
      ) : (
        <div>
          {product.discounts.map((discount, index) => (
            <div key={index} className="mb-2">
              <span>
                {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
              </span>
            </div>
          ))}
          <button
            data-testid="modify-button"
            onClick={() => setIsEdit(true)}
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
          >
            수정
          </button>
        </div>
      )}
    </div>
  );
}
