import CartItemCard from './CartItemCard.tsx';
import { CartItem } from '../../types.ts';

interface CartItemCardWrapperProps {
  item: CartItem;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;
}

const CartItemCardWrapper = (props: CartItemCardWrapperProps) => {
  const getAppliedDiscount = (item: CartItem) =>
    item.product.discountList
      .filter((discount) => item.quantity >= discount.quantity)
      .reduce((max, discount) => Math.max(max, discount.rate), 0);

  const appliedDiscount = getAppliedDiscount(props.item);

  return <CartItemCard {...props} discount={appliedDiscount} />;
};

export default CartItemCardWrapper;
