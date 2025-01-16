import { CartItem, Coupon } from "../../types";

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const maxDiscountRate = getMaxApplicableDiscount(item);

  return product.price * quantity * (1 - maxDiscountRate);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { product, quantity } = item;
  return product.discounts
    .filter((discount) => quantity >= discount.quantity) // 조건 만족하는 할인만 추출
    .reduce((maxRate, discount) => Math.max(maxRate, discount.rate), 0); // 최대 할인율 추출
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const discountStrategies: Record<
    "amount" | "percentage",
    (price: number, value: number) => number
  > = {
    amount: (price, value) => value, // 고정 금액 할인
    percentage: (price, value) => (price * value) / 100, // 퍼센트 할인
  };

  const totalBeforeDiscount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalMaxApplicableDiscount = cart.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity * getMaxApplicableDiscount(item),
    0
  );

  const totalCouponDiscount = selectedCoupon
    ? discountStrategies[selectedCoupon.discountType](
        totalBeforeDiscount - totalMaxApplicableDiscount,
        selectedCoupon?.discountValue
      )
    : 0;

  const totalDiscount = totalMaxApplicableDiscount + totalCouponDiscount;
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
  return cart
    .map((item: CartItem) => {
      const adjustedQuantity =
        item.product.id === productId
          ? Math.min(newQuantity, item.product.stock)
          : item.quantity;
      return {
        ...item,
        quantity: adjustedQuantity,
      };
    })
    .filter((item: CartItem) => item.quantity > 0);
};
