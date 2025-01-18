import { Discount } from '@types';
import { ProductDiscountItem } from './ProductDiscountItem';

interface ProductDiscountListProps {
  discounts: Discount[];
}

export function ProductDiscountList({ discounts }: ProductDiscountListProps) {
  return (
    <ul className="list-disc list-inside text-sm text-gray-500 mb-2">
      {discounts.map((discount, index) => (
        <ProductDiscountItem key={index} discount={discount} />
      ))}
    </ul>
  );
}
