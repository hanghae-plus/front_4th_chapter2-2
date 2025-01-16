import ProductCard from './ProductCard.tsx';
import { CartItem, Product } from '../../types.ts';
import { getRemainingStock } from '../models/cart.ts';

interface ProductCardWrapperProps {
  cart: CartItem[];
  product: Product;
  addToCart: (product: Product) => void;
}

const ProductCardWrapper = ({ cart, product, addToCart }: ProductCardWrapperProps) => {
  const getMaxDiscount = (discountList: { quantity: number; rate: number }[]) =>
    discountList.reduce((max, discount) => Math.max(max, discount.rate), 0);

  return (
    <ProductCard
      stock={getRemainingStock(product, cart)}
      product={product}
      addToCart={addToCart}
      discount={getMaxDiscount(product.discountList) * 100}
    />
  );
};

export default ProductCardWrapper;
