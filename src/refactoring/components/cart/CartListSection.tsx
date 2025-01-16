import { memo } from "react";
import { CartItem } from "../../../types";
import CartItemCard from "./CartItemCard";

const CartListSection = ({
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
}: {
  cart: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveFromCart: (id: string) => void;
}) => {
  const getAppliedDiscount = (item: CartItem) => {
    const { quantity, product } = item;
    const { discounts } = product;

    let appliedDiscount = 0;
    for (const discount of discounts) {
      if (quantity >= discount.quantity) {
        appliedDiscount = Math.max(appliedDiscount, discount.rate);
      }
    }

    return appliedDiscount;
  };

  return (
    <div className="space-y-2">
      {cart.map((item) => {
        const appliedDiscount = getAppliedDiscount(item);

        return (
          <CartItemCard
            key={item.product.id}
            item={item}
            appliedDiscount={appliedDiscount}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveFromCart={onRemoveFromCart}
          />
        );
      })}
    </div>
  );
};

export default memo(CartListSection);
