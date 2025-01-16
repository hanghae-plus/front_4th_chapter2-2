import { CartItem, Coupon } from '../../types';

export const calculateCoupon = (totalBeforeCoupon: number, selectedCoupon: Coupon | null) => {
  if (!selectedCoupon || totalBeforeCoupon === 0) return 0;

  const { discountType, discountValue } = selectedCoupon;

  return discountType === 'amount'
    ? discountValue
    : totalBeforeCoupon * Math.abs(discountValue / 100);
};

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;

  return product.price * quantity * (1 - getMaxApplicableDiscount(item));
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const totalBeforeDiscount = cart.reduce(
    (acc, { product, quantity }) => product.price * quantity + acc,
    0,
  );

  const totalItemDiscount = cart.reduce(
    (acc, item) => acc - calculateItemTotal(item),
    totalBeforeDiscount,
  );

  const totalDiscount =
    totalItemDiscount + calculateCoupon(totalBeforeDiscount - totalItemDiscount, selectedCoupon);

  const totalAfterDiscount =
    totalBeforeDiscount - totalDiscount > 0 ? totalBeforeDiscount - totalDiscount : 0;

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  };
};

/**
 * discount.ts 로 분리
 * test code 대비
 */
export const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const {
    product: { discounts },
    quantity,
  } = item;

  if (discounts.length === 0) return 0;
  const avaliableDiscount = discounts.filter((discount) => discount.quantity <= quantity);

  return getMaxDiscount(avaliableDiscount);
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] => {
  const newCart = cart
    .map((prev) => {
      if (prev.product.id === productId) {
        if (newQuantity <= 0) return null;
        else return { product: prev.product, quantity: Math.min(newQuantity, prev.product.stock) };
      } else return prev;
    })
    .filter((item) => item !== null) as CartItem[];

  return newCart;
};
