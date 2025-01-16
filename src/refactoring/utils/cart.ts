import { CartItem, Coupon } from "../../types.ts";

export const calculateItemTotal = (item: CartItem) => {
  if (!item) return 0;

  const { discounts } = item.product;
  const { quantity } = item;

  // 요구사항 1: 할인 없이 총액을 계산해야 합니다 | price * quantity
  const total = item.product.price * item.quantity;

  // 요구사항 2: 수량에 따라 올바른 할인을 적용해야 합니다 | reduce
  const rateByQuantity = discounts.reduce((acc, prevProduct) => {
    // 수량과 일치하는 할인율을 찾아서 해당 할인율 적용
    if (quantity === prevProduct.quantity) {
      const discount = prevProduct.rate;
      return acc * (1 - discount); // 할인율 적용 로직
    }
    return acc;
  }, total)

  return rateByQuantity;
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  if (!item) return 0;

  const { discounts } = item.product;
  const { quantity } = item;

  // return Math.max(...discounts.map(prevRate => prevRate.rate));
  // 위 방법도 간결하고 좋지만 0을 반환하지 못해 요구사항 1을 충족시키지 못한다

  // 요구사항 2: 적용 가능한 가장 높은 할인율을 반환해야 합니다 | reduce
  return discounts.reduce((max, prevProduct) => {
    if (prevProduct.quantity === quantity) {
      return Math.max(max, prevProduct.rate);
    }
    return max;
  }, 0); // 요구사항 1: 할인이 적용되지 않으면 0을 반환해야 합니다 | reduce
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  // 기본값을 const로 설정
  const { totalBeforeDiscount, totalAfterDiscount } = cart.reduce(
    (acc, item) => {
      const { price } = item.product;
      const { quantity } = item;

      const itemTotal = price * quantity;
      const maxDiscountRate = item.product.discounts.reduce((maxRate, d) =>
        quantity >= d.quantity && d.rate > maxRate ? d.rate : maxRate, 0
      );

      const discountAmount = itemTotal * maxDiscountRate;
      acc.totalBeforeDiscount += itemTotal;
      acc.totalAfterDiscount += itemTotal - discountAmount;
      acc.totalDiscount += discountAmount;

      return acc;
    },
    { totalBeforeDiscount: 0, totalAfterDiscount: 0, totalDiscount: 0 }
  );

  // 쿠폰 적용 로직 개선
  const finalTotalAfterDiscount = selectedCoupon
    ? calculateCoupon(totalAfterDiscount, selectedCoupon.discountType, selectedCoupon.discountValue)
    : totalAfterDiscount;

  const finalTotalDiscount = totalBeforeDiscount - finalTotalAfterDiscount;

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(finalTotalAfterDiscount),
    totalDiscount: Math.round(finalTotalDiscount)
  };
}

const calculateCoupon = (initValue: number, discountType: 'amount' | 'percentage', discountValue: number): number => {
  // 요구사항 2. 금액쿠폰을 올바르게 적용해야 합니다
  // 요구사항 3. 퍼센트 쿠폰을 올바르게 적용해야 합니다
  return discountType === 'amount'
    ? Math.max(0, initValue - discountValue)
    : initValue * (1 - discountValue / 100);
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  if (!cart || !productId || newQuantity < 0) return cart;

  // 요구사항 1: 수량을 올바르게 업데이트해야 합니다
  const newCart = cart
    .map((value) => {
      if (value.product.id === productId && value.quantity !== newQuantity) {
        // 요구사항 3: 재고 한도를 초과해서는 안 됩니다
        const maxQuantity = Math.min(newQuantity, value.product.stock);
        return { ...value, quantity: maxQuantity};
      }
      return value;
    })
    .filter(value => value.quantity !== 0); // 요구사항 2: 수량이 0으로 설정된 경우 항목을 제거해야 합니다

  return newCart;
};