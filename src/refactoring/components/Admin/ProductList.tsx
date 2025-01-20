import { Product } from 'src/types';
import { ProductAccordion } from './ProductAccordion';

interface ProductListProps {
  productList: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
}

export const ProductList = ({ productList, onProductUpdate }: ProductListProps) => {
  return (
    <div className='space-y-2'>
      {productList.map((product) => (
        <ProductAccordion key={product.id} product={product} onProductUpdate={onProductUpdate} />
      ))}
    </div>
  );
};
