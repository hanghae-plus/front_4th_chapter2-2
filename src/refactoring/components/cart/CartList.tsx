import { CartItem as CartItemType, Coupon } from '@types';
import { useCart } from '@refactoring/hooks';
import { CartItem } from './CartItem';
import { Heading } from '../shared/Heading';
import { CartSummary } from './CartSummary';
import { CouponApply } from '../coupon/CouponApply';

interface CartListProps {
  cart: CartItemType[];
  updateQuantity: ReturnType<typeof useCart>['updateQuantity'];
  removeFromCart: ReturnType<typeof useCart>['removeFromCart'];
  calculateTotal: ReturnType<typeof useCart>['calculateTotal'];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
}

export function CartList({
  cart,
  updateQuantity,
  removeFromCart,
  calculateTotal,
  coupons,
  selectedCoupon,
  applyCoupon,
}: CartListProps) {
  return (
    <div>
      <Heading as="h2" className="text-2xl font-semibold mb-4">
        장바구니 내역
      </Heading>
      <div className="space-y-2">
        {cart.map((cartItem) => (
          <CartItem
            key={cartItem.product.id}
            cartItem={cartItem}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
          />
        ))}
      </div>
      <CouponApply
        coupons={coupons}
        selectedCoupon={selectedCoupon}
        applyCoupon={applyCoupon}
      />
      <CartSummary calculateTotal={calculateTotal} />
    </div>
  );
}
