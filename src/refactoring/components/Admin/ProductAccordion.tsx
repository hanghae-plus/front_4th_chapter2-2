import { useState } from 'react';
import { Product } from 'src/types';
import { ProductEdit } from './ProductEdit';

interface ProductAccordionProps {
  product: Product;
  onProductUpdate: (updatedProduct: Product) => void;
}

export const ProductAccordion = ({ product, onProductUpdate }: ProductAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div data-testid={`product-${product.id}`} className='bg-white p-4 rounded shadow'>
      <button
        data-testid='toggle-button'
        onClick={() => setIsOpen((prev) => !prev)}
        className='w-full text-left font-semibold'
      >
        {product.name} - {product.price}원 (재고: {product.stock})
      </button>
      {isOpen && (
        <div>
          <button
            data-testid='modify-button'
            className='bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2'
            onClick={() => {}}
          >
            수정
          </button>
          <ProductEdit product={product} onProductUpdate={onProductUpdate} />
        </div>
      )}
    </div>
  );
};
