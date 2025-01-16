import { CartItem, CartSummary, useCart } from '@advanced/features/cart';
import { Heading } from '@advanced/shared/ui';
import { CouponApply } from './CouponApply';

export function CartList() {
  const cart = useCart((state) => state.cart);
  return (
    <div>
      <Heading as="h2" className="text-2xl font-semibold mb-4">
        장바구니 내역
      </Heading>
      <div className="space-y-2">
        {cart.map((cartItem) => (
          <CartItem key={cartItem.product.id} cartItem={cartItem} />
        ))}
      </div>
      <CouponApply />
      <CartSummary />
    </div>
  );
}
