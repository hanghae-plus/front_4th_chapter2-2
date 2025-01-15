import CartList from '../../features/cart/CartList';
import OrderSummary from '../../features/cart/OrderSummary';
import CouponSelector from '../../features/coupons/CouponSelector';
import { CartItem, Coupon } from '../../shared/types/types';

interface CartSummaryWidgetProps {
  cart: CartItem[];

  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  getAppliedDiscount: (item: CartItem) => number;
}

const CartSummaryWidget = (props: CartSummaryWidgetProps) => {
  const {
    cart,

    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
    removeFromCart,
    updateQuantity,
    getAppliedDiscount,
  } = props;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>
      <CartList
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        getAppliedDiscount={getAppliedDiscount}
      />
      <CouponSelector />
      <OrderSummary
        totalBeforeDiscount={totalBeforeDiscount}
        totalAfterDiscount={totalAfterDiscount}
        totalDiscount={totalDiscount}
      />
    </div>
  );
};

export default CartSummaryWidget;
