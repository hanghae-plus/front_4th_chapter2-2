import { useState } from 'react';
import { useProductStore } from '../../../entities/product/model/useProductStore';
import ProductEditForm from './ProductEditForm';

function ProductList() {
  const { products } = useProductStore();

  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());

  const toggleInSet = (set: Set<string>, value: string): Set<string> => {
    const newSet = new Set(set);
    newSet.has(value) ? newSet.delete(value) : newSet.add(value);
    return newSet;
  };

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => toggleInSet(prev, productId));
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
            data-testid="toggle-button"
            onClick={() => toggleProductAccordion(product.id)}
            className="w-full text-left font-semibold"
          >
            {product.name} - {product.price}원 (재고: {product.stock})
          </button>
          {openProductIds.has(product.id) && (
            <ProductEditForm product={product} />
          )}
        </div>
      ))}
    </div>
  );
}

export default ProductList;
