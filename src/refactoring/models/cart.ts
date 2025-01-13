import { CartItem, Coupon, Product } from '../../types';

export const calculateItemTotal = (item: CartItem) => {
  const noDiscountTotal = getBeforeDiscount(item);
  const totalDiscount = noDiscountTotal * getMaxApplicableDiscount(item);

  return noDiscountTotal - totalDiscount;
};

export const getBeforeDiscount = (item: CartItem) => {
  return item.product.price * item.quantity;
};
export const getMaxApplicableDiscount = (item: CartItem) => {
  let maxDiscountRate = item.product.discounts
    .filter(({ quantity }) => quantity <= item.quantity)
    .reduce((max, discount) => Math.max(max, discount.rate), 0);

  return maxDiscountRate;
};

const calculateCouponDiscount = (
  price: number,
  selectedCoupon: Coupon | null
) => {
  if (!selectedCoupon) return 0;

  if (selectedCoupon.discountType === 'percentage')
    return price * selectedCoupon.discountValue * 0.01;

  return selectedCoupon.discountValue;
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const totalBeforeDiscount = cart.reduce(
    (total, item) => (total += getBeforeDiscount(item)),
    0
  );
  const applyDiscount = cart.reduce(
    (total, item) => (total += calculateItemTotal(item)),
    0
  );
  const couponDiscount = calculateCouponDiscount(applyDiscount, selectedCoupon);

  const totalDiscount = totalBeforeDiscount - applyDiscount + couponDiscount;
  const totalAfterDiscount = totalBeforeDiscount - totalDiscount;

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  const newCarts = cart
    .map((item) => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock;
        const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
        return updatedQuantity > 0
          ? { ...item, quantity: updatedQuantity }
          : null;
      }
      return item;
    })
    .filter((item) => item !== null);

  return newCarts;
};

export const getRemainingStock = (cart: CartItem[], product: Product) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};
