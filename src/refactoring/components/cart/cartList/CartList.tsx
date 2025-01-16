import { useCart, useCoupons } from '../../../hooks';
import Title from '../../atoms/Title';
import { CartApplyCoupon } from './cartApplyCoupon/CartApplyCoupon';
import { CartOrder } from './cartOrder/CartOrder';
import { CartProductItem } from './CartProductItem/CarProductItem';

export const CartList = () => {
  const { cart, calculateTotal } = useCart();
  const { coupons } = useCoupons();

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal();

  return (
    <div>
      <Title level={2} mbNum={4} text="장바구니 내역" />
      <CartProductItem cart={cart} />
      <CartApplyCoupon coupons={coupons} />
      <CartOrder
        totalBeforeDiscount={totalBeforeDiscount}
        totalDiscount={totalDiscount}
        totalAfterDiscount={totalAfterDiscount}
      />
    </div>
  );
};
