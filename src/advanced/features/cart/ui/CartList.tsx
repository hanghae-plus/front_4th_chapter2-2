import { useCart } from '../model';
import { CartItem } from './CartItem';

export function CartList() {
  const cart = useCart((state) => state.cart);

  return (
    <div className="space-y-2">
      {cart.map((cartItem) => (
        <CartItem key={cartItem.product.id} cartItem={cartItem} />
      ))}
    </div>
  );
}
