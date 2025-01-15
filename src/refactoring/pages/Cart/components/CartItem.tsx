import { getMaxApplicableDiscount } from '@/refactoring/pages/Cart/model/cart';
import type { CartItem as CartItemType } from '@/types';

export interface CartItemProps {
  cart: CartItemType;
  onQuantityUpdate: (productId: string, newQuantity: number) => void;
  onCartRemove: (productId: string) => void;
}

export const CartItem = ({ cart, onQuantityUpdate, onCartRemove }: CartItemProps) => {
  const appliedDiscount = getMaxApplicableDiscount(cart);

  return (
    <div className="flex items-center justify-between rounded bg-white p-3 shadow">
      <div>
        <span className="font-semibold">{cart.product.name}</span>
        <br />
        <span className="text-sm text-gray-600">
          {cart.product.price}원 x {cart.quantity}
          {appliedDiscount > 0 && (
            <span className="ml-1 text-green-600">({(appliedDiscount * 100).toFixed(0)}% 할인 적용)</span>
          )}
        </span>
      </div>
      <div>
        <button
          onClick={() => onQuantityUpdate(cart.product.id, cart.quantity - 1)}
          className="mr-1 rounded bg-gray-300 px-2 py-1 text-gray-800 hover:bg-gray-400"
        >
          -
        </button>
        <button
          onClick={() => onQuantityUpdate(cart.product.id, cart.quantity + 1)}
          className="mr-1 rounded bg-gray-300 px-2 py-1 text-gray-800 hover:bg-gray-400"
        >
          +
        </button>
        <button
          onClick={() => onCartRemove(cart.product.id)}
          className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
        >
          삭제
        </button>
      </div>
    </div>
  );
};
