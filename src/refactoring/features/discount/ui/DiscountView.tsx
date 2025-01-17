import { IDiscount } from '../../../shared/types';

interface DiscountViewProps {
  discount: IDiscount;
}
export function DiscountView({ discount }: DiscountViewProps) {
  return (
    <div className="mb-2">
      <span>
        {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
      </span>
    </div>
  );
}
