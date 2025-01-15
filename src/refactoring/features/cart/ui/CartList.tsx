import { CartItem } from './CartItem.tsx';
import { ICartItem } from '../../../shared/types';

interface CartListProps {
  cart: ICartItem[];
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
}

export function CartList({
  cart,
  updateQuantity,
  removeFromCart,
}: CartListProps) {
  return (
    <div className="space-y-2">
      {cart.map((item) => (
        <CartItem
          key={item.product.id}
          item={item}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />
      ))}
    </div>
  );
}
