import { useState } from 'react';

import { ProductDetails } from '@/refactoring/pages/Admin/ProductManagement/ProductEditor/ProductDetails/ProductDetails';
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

  const handleEditStart = () => {
    setIsEditing(true);
  };

  return (
    // 아코디언 컴포넌트로 분리
    <div data-testid={`product-${testId}`} className="rounded bg-white p-4 shadow">
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
            <ProductDetails product={product} onEditStart={handleEditStart} />
          )}
        </div>
      )}
    </div>
  );
};
