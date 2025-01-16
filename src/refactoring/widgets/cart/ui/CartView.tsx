import { SectionTitle } from '../../../shared/ui/typography';
import { OrderSummary } from '../../../features/order/ui/OrderSummary.tsx';
import { CartList } from '../../../features/cart/ui/CartList.tsx';
import { CouponSelector } from '../../../features/coupon/ui/CouponSelector.tsx';

export function CartView() {
  return (
    <div>
      <SectionTitle title={'장바구니 내역'} />
      <CartList />
      <div className="mt-6 bg-white p-4 rounded shadow">
        <CouponSelector />
        <OrderSummary />
      </div>
    </div>
  );
}
