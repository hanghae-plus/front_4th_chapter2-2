import { Button } from '@/shared/ui';
import { getAppliedDiscount, useCartStore } from '@/entities/cart';
import { CartItem } from '@/shared/types';

interface SelectedItemProps {
  item: CartItem;
}

export const SelectedItem = ({ item }: SelectedItemProps) => {
  const { removeFromCart, updateQuantity } = useCartStore();

  const appliedDiscount = getAppliedDiscount(item);

  return (
    <div key={item.product.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
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
      <div>
        <Button variant="primary" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
          -
        </Button>
        <Button variant="primary" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
          +
        </Button>
        <Button variant="danger" onClick={() => removeFromCart(item.product.id)}>
          삭제
        </Button>
      </div>
    </div>
  );
};
