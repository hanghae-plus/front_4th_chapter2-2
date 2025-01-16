import { CartItem } from '@/refactoring/pages/Cart/ShoppingCart/components/CartItem';
import { CouponSelect } from '@/refactoring/pages/Cart/ShoppingCart/components/CouponSelect';
import { OrderSummary } from '@/refactoring/pages/Cart/ShoppingCart/components/OrderSummary';
import type { CartItem as CartItemType, Coupon } from '@/types';

interface ShoppingCartProps {
  cart: CartItemType[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  calculateTotal: () => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
    totalDiscount: number;
  };
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  applyCoupon: (coupon: Coupon) => void;
}

export const ShoppingCart = ({
  cart,
  coupons,
  selectedCoupon,
  calculateTotal,
  updateQuantity,
  removeFromCart,
  applyCoupon
}: ShoppingCartProps) => {
  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal();

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">장바구니 내역</h2>
      <div className="space-y-2">
        {cart.map(item => {
          return (
            <CartItem
              key={item.product.id}
              cart={item}
              onQuantityUpdate={updateQuantity}
              onCartRemove={removeFromCart}
            />
          );
        })}
      </div>

      <div className="mt-6 rounded bg-white p-4 shadow">
        <h2 className="mb-2 text-2xl font-semibold">쿠폰 적용</h2>
        <CouponSelect selectedCoupon={selectedCoupon} coupons={coupons} onCouponApply={applyCoupon} />
      </div>

      <div className="mt-6 rounded bg-white p-4 shadow">
        <h2 className="mb-2 text-2xl font-semibold">주문 요약</h2>
        <OrderSummary
          totalBeforeDiscount={totalBeforeDiscount}
          totalAfterDiscount={totalAfterDiscount}
          totalDiscount={totalDiscount}
        />
      </div>
    </div>
  );
};
