// useCart.ts
import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { calculateCartTotal, updateCartItemQuantity } from '../models/cart';

// 2. 장바구니 내역 나타내기
export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 2-1. 장바구니 내역에 상품 담기
  // 2-1. 계산: calculateAddToCart()
  const calculateAddToCart = (cart: CartItem[], product: Product) => {
    const remainingStock = getRemainingStock(product);
    if (remainingStock <= 0) return cart;

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

  // 2-1. 액션: addToCart()
  const addToCart = (product: Product) => {
    setCart((prevCart) => calculateAddToCart(prevCart, product));
  };

  // 2-2. 장바구니 내역에 상품 삭제하기
  // 2-2. 계산+액션: removeFromCart()
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  // 2-3. 장바구니 내역에 상품의 갯수 조절하기
  // 2-3. 계산: calculateUpdateQuantity()
  const calculateUpdateQuantity = (
    cart: CartItem[],
    productId: string,
    newQuantity: number
  ): CartItem[] => {
    return cart
      .map((item) => {
        if (item.product.id === productId) {
          const maxQuantity = item.product.stock;
          const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
          return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
        }
        return item;
      })
      .filter((item): item is CartItem => item !== null);
  };

  // 2-3. 액션: updateQuantity()
  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) => calculateUpdateQuantity(prevCart, productId, newQuantity));
  };

  // 2-4. 쿠폰 선택하기
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  // 2-5. 장바구니 내 모든 상품 총액 계산하기
  // 2-5. 계산: calculateTotals()
  const calculateTotals = (cart: CartItem[]) => ({
    totalBeforeDiscount: Math.round(
      cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    ),
    totalAfterDiscount: Math.round(
      cart.reduce((sum, item) => {
        const { price, discounts } = item.product;
        const { quantity } = item;
        const discount = discounts.reduce((maxDiscount, d) => {
          return quantity >= d.quantity && d.rate > maxDiscount ? d.rate : maxDiscount;
        }, 0);
        return sum + price * quantity * (1 - discount);
      }, 0)
    ),
    totalDiscount: 0,
  });

  // 2-5. 쿠폰 적용하기
  // 2-5. 계산: applyCouponDiscount()
  const applyCouponDiscount = (
    totalAfterDiscount: number,
    totalBeforeDiscount: number,
    selectedCoupon: Coupon | null
  ) => {
    if (!selectedCoupon)
      return { totalAfterDiscount, totalDiscount: totalBeforeDiscount - totalAfterDiscount };

    let updatedTotalAfterDiscount = totalAfterDiscount;

    if (selectedCoupon.discountType === 'amount') {
      updatedTotalAfterDiscount = Math.max(
        0,
        updatedTotalAfterDiscount - selectedCoupon.discountValue
      );
    } else {
      updatedTotalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
    }

    const totalDiscount = totalBeforeDiscount - updatedTotalAfterDiscount;

    return {
      totalAfterDiscount: updatedTotalAfterDiscount,
      totalDiscount,
    };
  };

  // 2-5. 액션: calculateTotal()
  const calculateTotal = () => {
    const { totalBeforeDiscount, totalAfterDiscount: initialTotalAfterDiscount } =
      calculateTotals(cart);

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

  const getRemainingStock = (product: Product) => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  };
};
