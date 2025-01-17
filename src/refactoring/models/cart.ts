import { CartItem, Coupon, Discount } from "../../types";

// 적용가능한 할인을 찾는다
const findApplicableDiscount = (
  discounts: Discount[] | undefined,
  quantity: number
): Discount | undefined => {
  if (!discounts) return undefined;
  return discounts
    .filter((d) => quantity >= d.quantity)
    .sort((a, b) => b.rate - a.rate)[0];
};

// 상품의 기본 총액을 계산한다
const calculateItemBasePrice = (price: number, quantity: number) => {
  return price * quantity;
};

// 할인율을 적용한 가격을 계산한다
const applyDiscountRate = (price: number, discountRate: number) => {
  return price * (1 - discountRate);
};

export const calculateItemTotal = (item: CartItem) => {
  const { quantity, product } = item;
  const { price, discounts } = product;

  const appliableDiscount = findApplicableDiscount(discounts, quantity);
  const discountRate = appliableDiscount?.rate || 0;
  const basePrice = calculateItemBasePrice(price, quantity);

  return applyDiscountRate(basePrice, discountRate);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { quantity, product } = item;
  const { discounts } = product;

  const appliableDiscount = findApplicableDiscount(discounts, quantity);
  return appliableDiscount?.rate || 0;
};

const calculateItemBaseTotal = (item: CartItem) => {
  return item.product.price * item.quantity;
};

const calculateCartTotalBeforeDiscount = (cart: CartItem[]) => {
  return cart.reduce((sum, item) => {
    return sum + calculateItemBaseTotal(item);
  }, 0);
};

const calculateQuantityDiscount = (cart: CartItem[]): number => {
  return cart.reduce((sum, item) => {
    const discountRate = getMaxApplicableDiscount(item);
    return sum + calculateItemBaseTotal(item) * discountRate;
  }, 0);
};

const calculateCouponDiscount = (
  priceAfterQuantityDiscount: number,
  coupon: Coupon | null
): number => {
  if (!coupon) return 0;

  if (coupon.discountType === "amount") {
    return coupon.discountValue;
  }
  if (coupon.discountType === "percentage") {
    return (priceAfterQuantityDiscount * coupon.discountValue) / 100;
  }
  return 0;
};

const calculateFinalAmounts = (
  totalBeforeDiscount: number,
  quantityDiscount: number,
  couponDiscount: number
) => {
  const totalDiscount = quantityDiscount + couponDiscount;
  const totalAfterDiscount = totalBeforeDiscount - totalDiscount;

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  };
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const totalBeforeDiscount = calculateCartTotalBeforeDiscount(cart);
  const quantityDiscount = calculateQuantityDiscount(cart);
  const priceAfterQutntityDiscount = totalBeforeDiscount - quantityDiscount;
  const couponDiscount = calculateCouponDiscount(
    priceAfterQutntityDiscount,
    selectedCoupon
  );

  return calculateFinalAmounts(
    totalBeforeDiscount,
    quantityDiscount,
    couponDiscount
  );
};

// 수량 제한
const applyQuantityLimit = (quantity: number, stock: number): number => {
  return Math.min(quantity, stock);
};

// 장바구니 아이템 제거
const removeCartItem = (cart: CartItem[], productId: string): CartItem[] => {
  return cart.filter((item) => item.product.id !== productId);
};

// 개별 아이템 수량 업데이트
const updateItemQuantity = (
  item: CartItem,
  productId: string,
  newQuantity: number
): CartItem => {
  if (item.product.id === productId) {
    const limitedQuantity = applyQuantityLimit(newQuantity, item.product.stock);
    return { ...item, quantity: limitedQuantity };
  }
  return item;
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  if (newQuantity <= 0) {
    return removeCartItem(cart, productId);
  }

  return cart.map((item) => {
    return updateItemQuantity(item, productId, newQuantity);
  });
};
