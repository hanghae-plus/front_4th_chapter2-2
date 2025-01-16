import { formatCurrency } from '../../../../utils/fotmatCurrency';
import { getAppliedDiscount } from '../models/getAppliedDiscount';

import type { CartItem } from '../../../../../types';

interface CartInfoProps {
  item: CartItem;
}

export const CartInfo = ({ item }: CartInfoProps) => {
  const appliedDiscount = getAppliedDiscount(item);

  return (
    <div>
      <span className="font-semibold">{item.product.name}</span>
      <br />
      <span className="text-sm text-gray-600">
        {formatCurrency(item.product.price)} x {item.quantity}
        {appliedDiscount > 0 && (
          <span className="text-green-600 ml-1">({(appliedDiscount * 100).toFixed(0)}% 할인 적용)</span>
        )}
      </span>
    </div>
  );
};
