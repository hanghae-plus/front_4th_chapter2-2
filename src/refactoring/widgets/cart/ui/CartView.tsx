import { SectionTitle } from '../../../shared/ui/typography';
import { ICartItem, ICoupon } from '../../../shared/types';
import { OrderSummary } from '../../../features/order/ui/OrderSummary.tsx';
import { CartList } from '../../../features/cart/ui/CartList.tsx';
import { CouponSelector } from '../../../features/coupon/ui/CouponSelector.tsx';

interface CartViewProps {
  cart: ICartItem[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  applyCoupon: (coupon: ICoupon) => void;
  calculateTotal: () => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
    totalDiscount: number;
  };
  coupons: ICoupon[];
  selectedCoupon: ICoupon | null;
}

export function CartView({
  cart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  calculateTotal,
  coupons,
  selectedCoupon,
}: CartViewProps) {
  return (
    <div>
      <SectionTitle title={'장바구니 내역'} />
      <CartList
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />
      <div className="mt-6 bg-white p-4 rounded shadow">
        <CouponSelector
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          applyCoupon={applyCoupon}
        />
        <OrderSummary calculateTotal={calculateTotal} />
      </div>
    </div>
  );
}
