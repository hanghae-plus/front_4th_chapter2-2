import type { CartItem } from '../../../../types';

interface CartInfoProps {
  item: CartItem;
}

export const CartInfo = ({ item }: CartInfoProps) => {
  const getAppliedDiscount = (item: CartItem) => {
    const { discounts } = item.product;
    const { quantity } = item;
    let appliedDiscount = 0;
    for (const discount of discounts) {
      if (quantity >= discount.quantity) {
        appliedDiscount = Math.max(appliedDiscount, discount.rate);
      }
    }
    return appliedDiscount;
  };

  const appliedDiscount = getAppliedDiscount(item);

  return (
    <div>
      <span className="font-semibold">{item.product.name}</span>
      <br />
      <span className="text-sm text-gray-600">
        {item.product.price}원 x {item.quantity}
        {appliedDiscount > 0 && (
          <span className="text-green-600 ml-1">({(appliedDiscount * 100).toFixed(0)}% 할인 적용)</span>
        )}
      </span>
    </div>
  );
};
