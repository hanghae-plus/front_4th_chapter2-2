import { CartItem } from './CartItem.tsx';
import { useCartContext } from '../../../pages/cart/model';

export function CartList() {
  const { cart, updateQuantity, removeFromCart } = useCartContext();
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
