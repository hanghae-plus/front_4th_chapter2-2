import { Product } from '../../../../../../types';
import { ProductPrice } from './ProductPrice';
import { ProductStock } from './ProductStock';
import { ProductDiscounts } from './ProductDiscounts';
import { AddToCartButton } from './AddToCartButton/AddToCartButton';

interface ProductCardProps {
  product: Product;
  remainingStock: number;
}

export const CartProductCard = ({ product, remainingStock }: ProductCardProps) => {
  return (
    <div data-testid={`product-${product.id}`} className="bg-white p-3 rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{product.name}</span>
        <ProductPrice price={product.price} />
      </div>
      <ProductStock remainingStock={remainingStock} discounts={product.discounts} />
      <ProductDiscounts discounts={product.discounts} />
      <AddToCartButton product={product} remainingStock={remainingStock} />
    </div>
  );
};
