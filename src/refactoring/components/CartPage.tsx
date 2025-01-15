import { useCart } from '../hooks';
import { CartItemType, CouponType, ProductType } from '../types';
import { CartPageUI } from './cart/CartPageUI';

interface Props {
  productList: ProductType[];
  couponList: CouponType[];
}

export const CartPage = ({ productList, couponList }: Props) => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  } = useCart();

  const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) =>
    discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);

  const getRemainingStock = (product: ProductType) => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal();

  const getAppliedDiscount = (item: CartItemType) => {
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

  return (
    <CartPageUI
      productList={productList}
      couponList={couponList}
      cart={cart}
      addToCart={addToCart}
      removeFromCart={removeFromCart}
      updateQuantity={updateQuantity}
      applyCoupon={applyCoupon}
      selectedCoupon={selectedCoupon}
      totalBeforeDiscount={totalBeforeDiscount}
      totalAfterDiscount={totalAfterDiscount}
      totalDiscount={totalDiscount}
      getMaxDiscount={getMaxDiscount}
      getRemainingStock={getRemainingStock}
      getAppliedDiscount={getAppliedDiscount}
    />
  );
};
