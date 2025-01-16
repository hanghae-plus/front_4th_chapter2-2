import { CartItem, Coupon } from '../../types';

export const calculateItemTotal = (item: CartItem) => {
  let totlaPrice = 0;
  item.product.discounts.map((cartItem) => {
    if (cartItem.quantity === item.quantity) {
      const discountPrice = item.product.price * item.quantity * cartItem.rate;
      totlaPrice = item.product.price * item.quantity - discountPrice;
    } else {
      totlaPrice = item.product.price * item.quantity;
    }
  });
  return totlaPrice;
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  return item.product.discounts.reduce((maxDiscount, discount) => {
    return item.quantity >= discount.quantity ? Math.max(maxDiscount, discount.rate) : maxDiscount;
  }, 0);
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  // 할인 전 총액
  let totalBeforeDiscount = cart.reduce(
    (totalSum, cartItem) => totalSum + cartItem.product.price * cartItem.quantity,
    0,
  );

  // 아이템 수량 별 할인금액

  let itemDiscount = 0;

  cart.map((itemCart) => {
    itemDiscount += itemCart.product.price * itemCart.quantity * getMaxApplicableDiscount(itemCart);
  });

  let totalDiscount = 0;

  if (selectedCoupon) {
    cart.map((cartItem) => {
      if (selectedCoupon.discountType === 'percentage') {
        totalDiscount = (totalBeforeDiscount - itemDiscount) * (selectedCoupon.discountValue / 100);
      } else {
        totalDiscount = selectedCoupon.discountValue;
      }
    });
  }

  const totalAfterDiscount = totalBeforeDiscount - itemDiscount - totalDiscount;
  totalDiscount += itemDiscount;

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] => {
  let cartItemList = [];

  // 수량이 0으로 설정된 경우 항목을 제거
  if (newQuantity === 0) {
    cartItemList = cart.filter((cartItem) => cartItem.product.id !== productId);
  } else {
    // 수량을 올바르게 업데이트
    cartItemList = cart.map((cartItem) => {
      if (cartItem.product.id === productId) {
        cartItem.quantity = newQuantity;
      }

      return cartItem;
    });

    // 재고 한도를 초과하면 안됨
    cartItemList = cart.map((cartItem) => {
      if (cartItem.product.id === productId && cartItem.product.stock < newQuantity) {
        cartItem.quantity = cartItem.product.stock;
      }

      return cartItem;
    });
  }

  return cartItemList;
};
