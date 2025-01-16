import { clsx } from 'clsx';
import { Discount } from '../../../../../types';
import { formatDiscountRate } from '../../lib';

interface DiscountConditionProps {
  discounts: Discount[];
  variant?: 'bullet' | 'plain';
}

export function DiscountCondition({ discounts, variant = 'bullet' }: DiscountConditionProps) {
  return (
    <div>
      <ul
        className={clsx(
          'space-y-2',
          variant === 'bullet' ? 'list-disc list-inside text-sm text-gray-500' : 'list-none',
        )}
      >
        {discounts.map((discount, index) => {
          const key = `${index}-${discount.rate}`;
          return (
            <li key={key}>
              {variant === 'bullet'
                ? `${discount.quantity}개 이상: ${formatDiscountRate(discount.rate)} 할인`
                : `${discount.quantity}개 이상 구매 시 ${discount.rate * 100}% 할인`}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
