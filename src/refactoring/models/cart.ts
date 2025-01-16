import { CartItem, Coupon, Product } from '../../types';
import { CartTotalResult } from '../components/type/cart.type';
import {
  calculateCouponDiscount,
  getMaxDiscount,
  calculateItemDiscount,
  calculateTotalDiscount,
} from '../utils/cartUtils';

export const addItemToCart = (prevCart: CartItem[], product: Product): CartItem[] => {
  const existingItem = prevCart.find((item) => item.product.id === product.id);
  if (existingItem) {
    return prevCart.map((item) =>
      item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
    );
  }
  return [...prevCart, { product, quantity: 1 }];
};
//할인 없이 총액을 계산해야 한다.
//수량에 따라 올바른 할인을 적용해야 한다.
export const calculateItemTotal = (item: CartItem) => {
  const discount = calculateItemDiscount(item);
  return item.product.price * item.quantity * (1 - discount);
};

//적용 가능한 가장 높은 할인율을 반환해야 한다.
//할인이 적용되지 않으면 0을 반환해야 한다.
export const getMaxApplicableDiscount = (item: CartItem) => {
  return getMaxDiscount(item.product.discounts, (discount) => discount.quantity <= item.quantity);
};

export const calculateQuantityDiscount = (cart: CartItem[]): number => {
  return calculateTotalDiscount(cart);
};

//쿠폰 없이 총액을 올바르게 계산해야 한다.
//금액쿠폰을 올바르게 적용해야 한다.
//퍼센트 쿠폰을 올바르게 적용해야 한다.

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null,
): CartTotalResult => {
  // 기본 금액 계산
  const totalBeforeDiscount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  // 모든 할인을 한번에 계산
  const discounts = {
    quantity: calculateTotalDiscount(cart),
    coupon: calculateCouponDiscount(
      totalBeforeDiscount - calculateTotalDiscount(cart),
      selectedCoupon,
    ),
  };

  const totalDiscount = discounts.quantity + discounts.coupon;

  return {
    totalBeforeDiscount,
    totalAfterDiscount: totalBeforeDiscount - totalDiscount,
    totalDiscount,
  };
};

//수량을 올바르게 업데이트해야 한다.
//수량이 0으로 설정된 경우 항목을 제거해야 한다.
//재고 한도를 초과해서는 안 된다.
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] => {
  const item = cart.find((item) => item.product.id === productId);
  if (!item) return cart;

  if (newQuantity <= 0) {
    return cart.filter((item) => item.product.id !== productId);
  }

  if (newQuantity > item.product.stock) {
    return cart.map((item) =>
      item.product.id === productId ? { ...item, quantity: item.product.stock } : item,
    );
  }

  return cart.map((item) =>
    item.product.id === productId ? { ...item, quantity: newQuantity } : item,
  );
};
