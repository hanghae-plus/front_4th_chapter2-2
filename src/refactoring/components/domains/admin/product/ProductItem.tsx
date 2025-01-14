import { useState } from 'react';

import { ProductEditForm } from './ProductEditForm';
import { ProductItemDetail } from './ProductItemDetail';

import type { Product } from '../../../../../types';

interface ProductItemProps {
  product: Product;
  onProductUpdate: (updatedProduct: Product) => void;
}

export const ProductItem = ({ product, onProductUpdate }: ProductItemProps) => {
  // 현재 선택된 프로덕트인듯. 있어야할듯
  const [showEditForm, setShowEditForm] = useState(false);

  // 있어야함, (상품 수정 toggle)
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());

  // 유지 or 분리?
  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const toggleEditForm = () => {
    setShowEditForm((prev) => !prev);
  };

  return (
    <>
      <button
        data-testid="toggle-button"
        onClick={() => toggleProductAccordion(product.id)}
        className="w-full text-left font-semibold"
      >
        {product.name} - {product.price}원 (재고: {product.stock})
      </button>
      {openProductIds.has(product.id) && (
        <div className="mt-2">
          {showEditForm ? (
            <ProductEditForm product={product} onProductUpdate={onProductUpdate} onToggleEditForm={toggleEditForm} />
          ) : (
            <ProductItemDetail product={product} onToggleEditForm={toggleEditForm} />
          )}
        </div>
      )}
    </>
  );
};
