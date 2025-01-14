import CartList from '../../features/cart/CartList';
import OrderSummary from '../../features/cart/OrderSummary';
import CouponSelector from '../../features/coupons/CouponSelector';
import { CartItem, Coupon } from '../../shared/types/types';

interface CartSummaryWidgetProps {
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  onApplyCoupon: (coupon: Coupon) => void;
  getAppliedDiscount: (item: CartItem) => number;
}

const CartSummaryWidget = (props: CartSummaryWidgetProps) => {
  const {
    cart,
    coupons,
    selectedCoupon,
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
    removeFromCart,
    updateQuantity,
    onApplyCoupon,
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
      <CouponSelector coupons={coupons} selectedCoupon={selectedCoupon} onApplyCoupon={onApplyCoupon} />
      <OrderSummary
        totalBeforeDiscount={totalBeforeDiscount}
        totalAfterDiscount={totalAfterDiscount}
        totalDiscount={totalDiscount}
      />
    </div>
  );
};

export default CartSummaryWidget;
