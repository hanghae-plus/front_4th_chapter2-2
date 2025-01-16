import { useState } from 'react';

import { ProductDetails } from '@/refactoring/pages/Admin/ProductManagement/components/ProductEditor/ProductDetails';
import { ProductUpdateForm } from '@/refactoring/pages/Admin/ProductManagement/components/ProductEditor/ProductUpdateForm';
import { Collapsible } from '@/refactoring/pages/Admin/ProductManagement/ui/Collapsible';
import type { Product } from '@/types';

interface ProductEditorProps {
  product: Product;
  testId: string;
  onProductUpdate: (updatedProduct: Product) => void;
}

export const ProductEditor = ({ product, testId, onProductUpdate }: ProductEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditComplete = () => {
    setIsEditing(false);
  };

  const handleEditStart = () => {
    setIsEditing(true);
  };

  return (
    <Collapsible data-testid={`product-${testId}`} className="rounded bg-white p-4 shadow">
      <Collapsible.Toggle data-testid="toggle-button" className="w-full text-left font-semibold">
        {product.name} - {product.price}원 (재고: {product.stock})
      </Collapsible.Toggle>

      <Collapsible.Content>
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
      </Collapsible.Content>
    </Collapsible>
  );
};
