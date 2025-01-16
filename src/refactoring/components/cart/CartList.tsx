import { CartItem as CartItemType } from "../../../types";
import CartItem from "./CartItem";

interface CartListProps {
  cart: CartItemType[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

function CartList(props: CartListProps) {
  const { cart, removeFromCart, updateQuantity } = props;

  return (
    <div className="space-y-2">
      {cart.map((item) => (
        <CartItem
          key={item.product.id}
          item={item}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
        />
      ))}
    </div>
  );
}

export default CartList;
