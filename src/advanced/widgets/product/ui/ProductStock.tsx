import { getRemainingStock, useCart } from '@advanced/features/cart';
import { Product } from '@advanced/entities/product';

interface ProductStockProps {
  product: Product;
}

export function ProductStock({ product }: ProductStockProps) {
  const cart = useCart((state) => state.cart);
  const remainingStock = getRemainingStock(cart, product);

  return (
    <span
      className={`font-medium ${remainingStock > 0 ? 'text-green-600' : 'text-red-600'}`}
    >
      재고: {remainingStock}개
    </span>
  );
}
