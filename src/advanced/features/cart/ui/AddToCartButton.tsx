import { getRemainingStock, useCart } from '@advanced/features/cart';
import { Product } from '@advanced/entities/product';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const cart = useCart((state) => state.cart);
  const addToCart = useCart((state) => state.addToCart);
  const remainingStock = getRemainingStock(cart, product);

  return (
    <button
      onClick={() => addToCart(product)}
      className={`w-full px-3 py-1 rounded ${
        remainingStock > 0
          ? 'bg-blue-500 text-white hover:bg-blue-600'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
      disabled={remainingStock <= 0}
    >
      {remainingStock > 0 ? '장바구니에 추가' : '품절'}
    </button>
  );
}
