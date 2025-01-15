import React, { useState } from 'react';
import { Product } from '../../models/types/Product';
import ProductDescription from './ProductDescription';
import ProductUpdateForm from './ProductUpdateForm';

interface ProductListProps {
  products: Product[];
  onProductUpdate: (product: Product) => void;
}

function ProductList({ products, onProductUpdate }: ProductListProps) {
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const [openEditForm, setOpenEditForm] = useState(false);

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
    <div className="space-y-2">
      {products.map((product, index) => (
        <div
          key={product.id}
          data-testid={`product-${index + 1}`}
          className="bg-white p-4 rounded shadow"
        >
          <button
            type="button"
            data-testid="toggle-button"
            onClick={() => toggleProductAccordion(product.id)}
            className="w-full text-left font-semibold"
          >
            {product.name} - {product.price}원 (재고: {product.stock})
          </button>
          {openProductIds.has(product.id) && (
            <div className="mt-2">
              {openEditForm ? (
                <ProductUpdateForm
                  onProductUpdate={onProductUpdate}
                  product={product}
                  products={products}
                  closeEditForm={() => setOpenEditForm(false)}
                />
              ) : (
                <ProductDescription
                  product={product}
                  openEditForm={() => setOpenEditForm(true)}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProductList;
