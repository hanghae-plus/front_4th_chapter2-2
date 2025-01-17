import { useCart, useDiscountCalculator } from '../hooks';
import { CouponType, ProductType } from '../types';
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

  const { getMaxDiscount, getRemainingStock, getAppliedDiscount } = useDiscountCalculator(cart);

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
      calculateTotal={calculateTotal}
      getMaxDiscount={getMaxDiscount}
      getRemainingStock={getRemainingStock}
      getAppliedDiscount={getAppliedDiscount}
    />
  );
};
