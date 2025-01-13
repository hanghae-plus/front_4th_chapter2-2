import { CartItem, Coupon, Product } from '../../types';

export const calculateItemTotal = (item: CartItem) =>
  item.quantity * item.product.price * (1 - getMaxApplicableDiscount(item));

export const getMaxApplicableDiscount = (item: CartItem) =>
  item.product.discounts.reduce(
    (maxDiscount, discount) =>
      item.quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount,
    0,
  );

const calculateTotalAfterDiscount = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const totalDiscount = cart.reduce((total, item) => total + calculateItemTotal(item), 0);
  if (!selectedCoupon) {
    return totalDiscount;
  }

  return selectedCoupon.discountType === 'amount'
    ? Math.max(0, totalDiscount - selectedCoupon.discountValue)
    : totalDiscount * (1 - selectedCoupon.discountValue / 100);
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const totalBeforeDiscount = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const totalAfterDiscount = calculateTotalAfterDiscount(cart, selectedCoupon);

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount: totalBeforeDiscount - totalAfterDiscount,
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] =>
  cart
    .map((item) =>
      item.product.id === productId
        ? { ...item, quantity: Math.max(0, Math.min(newQuantity, item.product.stock)) }
        : item,
    )
    .filter((item) => item.quantity > 0);

export const getCartItem = (product: Product, cart: CartItem[]) =>
  cart.find((item) => item.product.id === product.id);

export const getRemainingStock = (product: Product, cart: CartItem[]) => {
  const cartItem = getCartItem(product, cart);
  return product.stock - (cartItem?.quantity || 0);
};

export const updateCartItem = (product: Product, cart: CartItem[]) =>
  cart.map((item) =>
    item.product.id === product.id
      ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
      : item,
  );

export const addCartItemToCart = (product: Product, cart: CartItem[]) => {
  if (getCartItem(product, cart)) {
    return updateCartItem(product, cart);
  }
  return [...cart, { product, quantity: 1 }];
};

export const getAppliedDiscount = (item: CartItem) =>
  item.product.discounts
    .filter((discount) => item.quantity >= discount.quantity)
    .reduce((max, discount) => Math.max(max, discount.rate), 0);
