import CartList from '../../features/cart/CartList';
import OrderSummary from '../../features/cart/OrderSummary';
import CouponSelector from '../../features/coupons/CouponSelector';
import { CartItem } from '../../shared/types/types';

interface CartSummaryWidgetProps {
  cart: CartItem[];
  calculateTotal: () => { totalBeforeDiscount: number; totalAfterDiscount: number; totalDiscount: number };
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
}

const CartSummaryWidget = (props: CartSummaryWidgetProps) => {
  const { cart, calculateTotal, removeFromCart, updateQuantity } = props;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>
      <CartList cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />
      <CouponSelector />
      <OrderSummary calculateTotal={calculateTotal} />
    </div>
  );
};

export default CartSummaryWidget;
