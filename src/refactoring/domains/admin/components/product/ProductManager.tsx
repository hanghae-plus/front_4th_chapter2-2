import { useState } from 'react';

import { ProductEditForm } from './ProductEditForm';
import { ProductForm } from './ProductForm';
import { ProductItemContainer } from './ProductItemContainer';
import { ProductItemDetail } from './ProductItemDetail';

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
    <>
      <button onClick={toggleProductForm} className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600">
        {showNewProductForm ? '취소' : '새 상품 추가'}
      </button>
      {/* 상품 추가 폼 */}
      {showNewProductForm && <ProductForm onProductAdd={onProductAdd} onToggleShowProductForm={toggleProductForm} />}
      <div className="space-y-2">
        {/* 상품 목록 */}
        {products.map((product, index) => (
          <div key={product.id} data-testid={`product-${index + 1}`} className="bg-white p-4 rounded shadow">
            <ProductItemContainer
              render={(openProductIds, showEditForm, toggleProductAccordion, toggleEditForm) => {
                const isOpenProduct = openProductIds.has(product.id);
                return (
                  <>
                    <ProductItem product={product} toggleProductAccordion={toggleProductAccordion} />
                    {isOpenProduct && (
                      <div className="mt-2">
                        {showEditForm ? (
                          <ProductEditForm
                            product={product}
                            onProductUpdate={onProductUpdate}
                            onToggleEditForm={toggleEditForm}
                          />
                        ) : (
                          <ProductItemDetail product={product} onToggleEditForm={toggleEditForm} />
                        )}
                      </div>
                    )}
                  </>
                );
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

const ProductItem = ({
  product,
  toggleProductAccordion,
}: {
  product: Product;
  toggleProductAccordion: (productId: string) => void;
}) => {
  return (
    <button
      data-testid="toggle-button"
      onClick={() => toggleProductAccordion(product.id)}
      className="w-full text-left font-semibold"
    >
      {product.name} - {product.price}원 (재고: {product.stock})
    </button>
  );
};
