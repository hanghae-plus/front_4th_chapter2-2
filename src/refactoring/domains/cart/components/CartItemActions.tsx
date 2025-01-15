import type { CartItem } from '../../../../types';

interface CartItemActionsProps {
  item: CartItem;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;
}

export const CartItemActions = ({ item, updateQuantity, removeFromCart }: CartItemActionsProps) => {
  return (
    <div>
      <button
        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
        className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
      >
        -
      </button>
      <button
        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
        className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
      >
        +
      </button>
      <button
        onClick={() => removeFromCart(item.product.id)}
        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
      >
        삭제
      </button>
    </div>
  );
};
