import { CartItem, Coupon, Discount } from "../../types";

export const calculateItemTotal = (item: CartItem) => {
  const { quantity, product } = item;
  const { price, discounts } = product;

  // 적용가능한 할인을 찾는다
  // TODO: 명확한 과정 파악하기
  const appliableDiscount = discounts
    ?.filter((d) => quantity >= d.quantity)
    .sort((a, b) => b.rate - a.rate)[0];

  const discountRate = appliableDiscount?.rate || 0;
  const total = price * quantity * (1 - discountRate);

  return total;
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { quantity, product } = item;
  const { discounts } = product;

  const appliableDiscount = discounts
    .filter((d) => quantity >= d.quantity)
    .sort((a, b) => b.rate - a.rate)[0];

  return appliableDiscount?.rate || 0;
};

// TODO: 명확한 이해 필요
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  // 할인 전의 총액을 계산한다
  const totalBeforeDiscount = cart.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  // 수량 할인을 계산한다
  let quantityDiscount = cart.reduce((sum, item) => {
    const discountRate = getMaxApplicableDiscount(item);
    return sum + item.product.price * item.quantity * discountRate;
  }, 0);

  // 수량 할인이 적용된 금액을 계산한다
  const priceAfterQutntityDiscount = totalBeforeDiscount - quantityDiscount;

  // 쿠폰 할인을 계산한다
  let couponDiscount = 0;
  if (selectedCoupon) {
    if (selectedCoupon.discountType === "amount") {
      couponDiscount = selectedCoupon.discountValue;
    } else if (selectedCoupon.discountType === "percentage") {
      couponDiscount =
        (priceAfterQutntityDiscount * selectedCoupon.discountValue) / 100;
    }
  }

  const totalDiscount = quantityDiscount + couponDiscount;
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
  // 남은 수량이 0이하인 경우 장바구니에서 제거한다
  if (newQuantity <= 0) {
    return cart.filter((item) => item.product.id !== productId);
  }

  return cart.map((item) => {
    if (item.product.id === productId) {
      // TODO: 명확한 과정 파악하기
      // Math.min: 재고 한도를 초과하지 않도록 제한한다
      const limitedQuantity = Math.min(newQuantity, item.product.stock);
      return { ...item, quantity: limitedQuantity };
    }
    return item;
  });
};
