import { Product } from '../../../types';
import { ProductItem } from './ProductItem';

interface ProductListProps {
  products: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
}

export interface DiscountType {
  quantity: number;
  rate: number;
}

export const ProductList = ({ products, onProductUpdate }: ProductListProps) => {
  return (
    <div className='space-y-4'>
      {products.map((product, index) => (
        <ProductItem
          key={product.id}
          product={product}
          index={index}
          onProductUpdate={onProductUpdate}
        />
      ))}
    </div>
  );
};
