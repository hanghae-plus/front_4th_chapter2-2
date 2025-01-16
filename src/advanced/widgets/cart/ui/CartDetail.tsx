import { Suspense } from 'react';
import { CartList, CartSummary } from '@advanced/features/cart';
import { Heading } from '@advanced/shared/ui';
import { CouponApply } from './CouponApply';

export function CartDetail() {
  return (
    <div>
      <Heading as="h2" className="text-2xl font-semibold mb-4">
        장바구니 내역
      </Heading>
      <CartList />
      <Suspense fallback={<>loading...</>}>
        <CouponApply />
      </Suspense>
      <CartSummary />
    </div>
  );
}
