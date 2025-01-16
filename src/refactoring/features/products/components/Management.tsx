import { useState } from 'react';
import { Product } from '../../../../types';
import { ProductAccordion } from './Accordion';
import { ProductForm } from './Form';

interface ProductManagementProps {
  products: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
}

export const ProductManagement = ({ products, onProductUpdate, onProductAdd }: ProductManagementProps) => {
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const [showNewProductForm, setShowNewProductForm] = useState(false);

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

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
      <button
        onClick={() => setShowNewProductForm(!showNewProductForm)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
      >
        {showNewProductForm ? '취소' : '새 상품 추가'}
      </button>

      {showNewProductForm && <ProductForm onProductAdd={onProductAdd} onCancel={() => setShowNewProductForm(false)} />}

      <div className="space-y-2">
        {products.map((product, index) => (
          <div key={product.id} data-testid={`product-${index + 1}`}>
            <ProductAccordion
              product={product}
              isOpen={openProductIds.has(product.id)}
              onToggle={toggleProductAccordion}
              onProductUpdate={onProductUpdate}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
