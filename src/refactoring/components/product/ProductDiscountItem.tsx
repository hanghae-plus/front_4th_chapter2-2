import { Discount } from '@types';

interface ProductDiscountItemProps {
  discount: Discount;
}

export function ProductDiscountItem({ discount }: ProductDiscountItemProps) {
  return (
    <li>
      {discount.quantity}개 이상: {(discount.rate * 100).toFixed(0)}% 할인
    </li>
  );
}
