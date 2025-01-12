import { CartItem, Coupon } from "../../types";

// 할인 없이 총액을 계산
export const calculateItemTotal = (item: CartItem) => {
	// 할인율  적용
	const discountRate = getMaxApplicableDiscount(item);

	return item.quantity * item.product.price * (1 - discountRate);
};

// 적용 가능한 가장 높은 할인율
export const getMaxApplicableDiscount = (item: CartItem) => {
	const { quantity } = item;

	return item.product.discounts.reduce((maxDiscount, d) => {
		return quantity >= d.quantity && d.rate > maxDiscount ? d.rate : maxDiscount;
	}, 0);
};

// 쿠폰 없이 총액 계산
// useCart에서 참조
export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
	return {
		totalBeforeDiscount: 0,
		totalAfterDiscount: 0,
		totalDiscount: 0,
	};
};

// 수량을 올바르게 업데이트해야
// 수량이 0으로 설정된 경우 항목을 제거해야
// 재고 한도를 초과해서는 안 됩니다
// useCart에서 참조
export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
	return [];
};
