import { useState } from 'react';

import { ProductForm } from './ProductForm';
import { ProductItem } from './ProductItem';

import type { Product } from '../../../../../types';

interface ProductManagerProps {
  products: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
}

export const ProductManager = ({ products, onProductUpdate, onProductAdd }: ProductManagerProps) => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const toggleProductForm = () => {
    setShowNewProductForm((prev) => !prev);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
      <button onClick={toggleProductForm} className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600">
        {showNewProductForm ? '취소' : '새 상품 추가'}
      </button>
      {showNewProductForm && <ProductForm onProductAdd={onProductAdd} onToggleShowProductForm={toggleProductForm} />}
      <div className="space-y-2">
        {products.map((product, index) => (
          <div key={product.id} data-testid={`product-${index + 1}`} className="bg-white p-4 rounded shadow">
            <ProductItem product={product} onProductUpdate={onProductUpdate} />
          </div>
        ))}
      </div>
    </div>
  );
};
