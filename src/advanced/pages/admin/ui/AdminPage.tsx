import { CouponManagement } from '@advanced/widgets/coupon';
import { ProductManagement } from '@advanced/widgets/product';
import { Heading } from '@advanced/shared/ui';

export function AdminPage() {
  return (
    <div className="container mx-auto p-4">
      <Heading as="h1" className="text-3xl font-bold mb-6">
        관리자 페이지
      </Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductManagement />
        <CouponManagement />
      </div>
    </div>
  );
}
