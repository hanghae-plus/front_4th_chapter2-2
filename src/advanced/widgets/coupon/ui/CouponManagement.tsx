import { Suspense } from 'react';
import { CouponForm, CouponList } from '@advanced/features/coupon';
import { Heading } from '@advanced/shared/ui';

export function CouponManagement() {
  return (
    <div>
      <Heading as="h2" className="text-2xl font-semibold mb-4">
        쿠폰 관리
      </Heading>
      <div className="bg-white p-4 rounded shadow">
        <CouponForm />
        <Suspense fallback={<>loading...</>}>
          <CouponList />
        </Suspense>
      </div>
    </div>
  );
}
