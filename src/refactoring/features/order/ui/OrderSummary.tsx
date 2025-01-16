import { SectionTitle } from '../../../shared/ui/typography';
import {
  useCartContext,
  useCartTotalContext,
} from '../../../entities/cart/model';

export function OrderSummary() {
  const { cart } = useCartContext();
  const { calculateTotal } = useCartTotalContext();
  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
    calculateTotal(cart);

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <SectionTitle title={'주문 요약'} />
      <div className="space-y-1">
        <p>상품 금액: {totalBeforeDiscount.toLocaleString()}원</p>
        <p className="text-green-600">
          할인 금액: {totalDiscount.toLocaleString()}원
        </p>
        <p className="text-xl font-bold">
          최종 결제 금액: {totalAfterDiscount.toLocaleString()}원
        </p>
      </div>
    </div>
  );
}
