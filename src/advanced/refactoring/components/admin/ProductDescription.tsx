import React from 'react';
import { Product } from '../../models/types/Product';

interface ProductDescriptionProps {
  product: Product;
  openEditForm: () => void;
}
function ProductDescription({
  product,
  openEditForm,
}: ProductDescriptionProps) {
  return (
    <div>
      {product.discounts.map((discount) => (
        <div key={discount.rate} className="mb-2">
          <span>
            {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
          </span>
        </div>
      ))}
      <button
        type="button"
        data-testid="modify-button"
        onClick={openEditForm}
        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
      >
        수정
      </button>
    </div>
  );
}

export default ProductDescription;
