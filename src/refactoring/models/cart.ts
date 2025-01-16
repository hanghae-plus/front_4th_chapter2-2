import { CartItem, Coupon, Product } from '../../types';

// 상품 가격 계산 함수
export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;

  const discount = getMaxApplicableDiscount(item);
  return product.price * quantity * (1 - discount);
};

// 상품 최대 할인율 계산 함수
export const getMaxApplicableDiscount = (item: CartItem) => {
  const { product, quantity } = item;

  const targetDiscount = product.discounts.reduce((maxDiscount, d) => {
    return quantity >= d.quantity && d.rate > maxDiscount ? d.rate : maxDiscount;
  }, 0);
  return targetDiscount;
};

// 장바구니 내역에 상품을 담는 함수
export const calculateAddToCart = (cart: CartItem[], product: Product) => {
  const exisitingItem = cart.find((item) => item.product.id === product.id);
  if (exisitingItem) {
    return cart.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
        : item
    );
  }

  return [...cart, { product, quantity: 1 }];
};

// 장바구니 내역 업데이트 계산 함수 분리
// 선택한 상품 수량 업데이트 함수
export const updateItemQuantity = (item: CartItem, newQuantity: number): CartItem | null => {
  const maxQuantity = item.product.stock;
  const updatedQuantity = Math.min(newQuantity, maxQuantity);

  return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
};

// 장바구니 내역 업데이트 함수
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] =>
  cart
    .map((item) => (item.product.id === productId ? updateItemQuantity(item, newQuantity) : item))
    .filter((item): item is CartItem => item !== null);

// 장바구니 총액 계산 함수 분리
// 장바구니 상품 계산 함수
export const calculateTotalDiscount = (cart: CartItem[]) => {
  console.log(cart);
  let totalBeforeDiscount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let totalAfterDiscount = cart.reduce((sum, item) => {
    const { price, discounts } = item.product;
    const { quantity } = item;
    const discount = discounts.reduce((maxDiscount, d) => {
      return quantity >= d.quantity && d.rate > maxDiscount ? d.rate : maxDiscount;
    }, 0);
    return sum + price * quantity * (1 - discount);
  }, 0);

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: 0,
  };
};

// 쿠폰 할인 적용 금액 계산 함수
export const applyCouponDiscount = (
  totalAfterDiscount: number,
  totalBeforeDiscount: number,
  selectedCoupon: Coupon | null
) => {
  if (!selectedCoupon)
    return { totalAfterDiscount, totalDiscount: totalBeforeDiscount - totalAfterDiscount };

  const { discountType, discountValue } = selectedCoupon;

  const updatedTotalAfterDiscount =
    discountType === 'amount'
      ? Math.max(0, totalAfterDiscount - discountValue)
      : totalAfterDiscount * (1 - discountValue / 100);

  return {
    totalAfterDiscount: updatedTotalAfterDiscount,
    totalDiscount: totalBeforeDiscount - updatedTotalAfterDiscount,
  };
};

// 장바구니 내 모든 상품 총액 계산 함수
export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const { totalBeforeDiscount, totalAfterDiscount: initialTotalAfterDiscount } =
    calculateTotalDiscount(cart);

  const { totalAfterDiscount, totalDiscount } = applyCouponDiscount(
    initialTotalAfterDiscount,
    totalBeforeDiscount,
    selectedCoupon
  );

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount: Math.round(totalDiscount),
  };
};
