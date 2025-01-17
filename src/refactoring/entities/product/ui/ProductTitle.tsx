import { Product } from '../../../../types';
import { formatPrice } from '../lib';

interface ProductTitleProps {
  product: Product;
}
export function ProductTitle({ product }: ProductTitleProps) {
  return (
    <div className="flex justify-between items-center mb-2">
      <span className="font-semibold">{product.name}</span>
      <span className="text-gray-600">{formatPrice(product.price)}</span>
    </div>
  );
}
