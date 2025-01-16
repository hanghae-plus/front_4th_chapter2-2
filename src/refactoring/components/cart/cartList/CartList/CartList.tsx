import { Coupon } from "../../../../../types";
import { useCart } from "../../../../hooks";
import Title from "../../../atoms/Title";
import { CartApplyCoupon } from "../../cartCoupon/CartApplyCoupon";
import { CartOrder } from "../../cartOrder/CartOrder";
import { CartProductItem } from "../../CartProductItem/CarProductItem";

interface CartListProps {
  coupons: Coupon[];
}

export const CartList = ({ coupons }: CartListProps) => {
  const { cart, calculateTotal } = useCart();
  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
    calculateTotal();

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
