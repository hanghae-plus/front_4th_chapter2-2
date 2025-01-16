// useCartStore.ts
import { create } from 'zustand';
import { CartItem, Coupon, Product } from '@/shared/types';

interface CartState {
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  // 각종 액션들
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  getRemainingStock: (product: Product) => number;
  calculateTotal: () => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
    totalDiscount: number;
  };
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  selectedCoupon: null,

  // 남은 재고량 계산 함수
  getRemainingStock: (product: Product): number => {
    const { cart } = get();
    const cartItem = cart.find((item) => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  },

  // 카트에 상품 추가 함수
  addToCart: (product: Product) => {
    const { getRemainingStock, cart } = get();
    const remainingStock = getRemainingStock(product);
    if (remainingStock <= 0) return;

    const existingItem = cart.find((item) => item.product.id === product.id);
    if (existingItem) {
      // 이미 카트에 있는 상품이라면 수량 업데이트 (최대 stock 값 제한)
      const updatedCart = cart.map((item) =>
        item.product.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item,
      );
      set({ cart: updatedCart });
    } else {
      // 처음 추가하는 상품이면 새 항목 추가
      set({ cart: [...cart, { product, quantity: 1 }] });
    }
  },

  // 카트에서 상품 제거 함수
  removeFromCart: (productId: string) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
    }));
  },

  // 카트 내 상품 수량 업데이트 함수
  updateQuantity: (productId: string, newQuantity: number) => {
    set((state) => ({
      cart: state.cart
        .map((item) => {
          if (item.product.id === productId) {
            const maxQuantity = item.product.stock;
            const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
            return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
          }
          return item;
        })
        // null 값은 카트에서 제거
        .filter((item): item is CartItem => item !== null),
    }));
  },

  // 쿠폰 적용 함수
  applyCoupon: (coupon: Coupon) => {
    set({ selectedCoupon: coupon });
  },

  // 총 결제 금액(할인 전/후, 할인액 계산) 함수
  calculateTotal: () => {
    const { cart, selectedCoupon } = get();
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    cart.forEach((item) => {
      const { price, discounts } = item.product;
      const quantity = item.quantity;
      totalBeforeDiscount += price * quantity;

      // 상품 할인 적용: 주문 수량에 맞게 최대 할인율 적용
      const discount = discounts.reduce((maxDiscount, d) => {
        return quantity >= d.quantity && d.rate > maxDiscount ? d.rate : maxDiscount;
      }, 0);
      totalAfterDiscount += price * quantity * (1 - discount);
    });

    let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

    // 쿠폰 할인 적용
    if (selectedCoupon) {
      if (selectedCoupon.discountType === 'amount') {
        totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
      } else {
        totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
      }
      totalDiscount = totalBeforeDiscount - totalAfterDiscount;
    }

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount),
      totalDiscount: Math.round(totalDiscount),
    };
  },
}));
