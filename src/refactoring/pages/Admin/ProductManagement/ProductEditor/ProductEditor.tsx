import { useState } from 'react';

import { ProductUpdateForm } from '@/refactoring/pages/Admin/ProductManagement/ProductEditor/ProductUpdateForm/ProductUpdateForm';
import type { Product } from '@/types';

interface ProductEditorProps {
  product: Product;
  testId: string;
  onProductUpdate: (updatedProduct: Product) => void;
}

export const ProductEditor = ({ product, testId, onProductUpdate }: ProductEditorProps) => {
  const [openProductId, setOpenProductId] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);

  const toggleProductAccordion = () => {
    setOpenProductId(prev => !prev);
  };

  const handleEditComplete = () => {
    setIsEditing(false);
  };

  return (
    // 아코디언 컴포넌트로 분리
    <div key={product.id} data-testid={`product-${testId}`} className="rounded bg-white p-4 shadow">
      <button data-testid="toggle-button" onClick={toggleProductAccordion} className="w-full text-left font-semibold">
        {product.name} - {product.price}원 (재고: {product.stock})
      </button>

      {openProductId && (
        <div className="mt-2">
          {isEditing ? (
            <ProductUpdateForm
              initProduct={product}
              onProductUpdate={onProductUpdate}
              onEditComplete={handleEditComplete}
            />
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
                onClick={() => setIsEditing(true)}
                className="mt-2 rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
              >
                수정
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
