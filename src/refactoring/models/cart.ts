import { CartItem, Coupon, Product } from '../../types';

export const calculateItemTotal = (item: CartItem) => {
  const beforeDiscount = calcTotalPrice(item);
  const maxDiscountRate = getMaxApplicableDiscount(item);

  // 할인율이 적용되지 않는 경우 바로 반환
  if (maxDiscountRate <= 0) {
    return beforeDiscount;
  }

  const totalDiscount = beforeDiscount * maxDiscountRate;
  return beforeDiscount - totalDiscount;
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  let applicableDiscounts = item.product.discounts.filter(({ quantity }) => quantity <= item.quantity);
  return getMaxDiscount(applicableDiscounts);
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const totalBeforeDiscount = calculateCartSum(cart, calcTotalPrice);
  const totalAfterDiscount = applyCouponDiscount(calculateCartSum(cart, calculateItemTotal), selectedCoupon);

  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount
  };
};

export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  const newCarts = cart
    .map(item => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock;
        const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
        return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
      }
      return item;
    })
    .filter(item => item !== null);

  return newCarts;
};

export const getRemainingStock = (cart: CartItem[], product: Product) => {
  const cartItem = cart.find(item => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

export const calculateCartSum = (cart: CartItem[], calculateFn: (item: CartItem) => number) => {
  return cart.reduce((total, item) => total + calculateFn(item), 0);
};

export const calcTotalPrice = (item: CartItem) => {
  return item.product.price * item.quantity;
};

export const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};

export const applyCouponDiscount = (price: number, selectedCoupon: Coupon | null) => {
  if (!selectedCoupon) return price;
  if (selectedCoupon.discountType === 'percentage') return price * (1 - selectedCoupon.discountValue * 0.01);
  return price - selectedCoupon.discountValue;
};
export const getAppliedDiscount = (item: CartItem) => {
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
