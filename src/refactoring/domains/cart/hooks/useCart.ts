import { useLocalStorage } from '../../../hooks';
import { calculateCartTotal, getRemainingStock, updateCartItemQuantity } from '../../../models/cart';

import type { CartItem, Coupon, Product } from '../../../../types';

export const useCart = () => {
  const { storageItem: cart, setItem: setCart } = useLocalStorage<CartItem[]>('cart', []);
  const { storageItem: selectedCoupon, setItem: setSelectedCoupon } = useLocalStorage<Coupon | null>(
    'selectedCoupon',
    null,
  );

  const addToCart = (product: Product) => {
    const remainingStock = getRemainingStock(product, cart);
    if (remainingStock <= 0) return;

    const updatedCart = cart.find((item) => item.product.id === product.id)
      ? cart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item,
        )
      : [...cart, { product, quantity: 1 }];

    setCart(updatedCart);
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter((item) => item.product.id !== productId);
    setCart(updatedCart);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const updatedCart = updateCartItemQuantity(cart, productId, newQuantity);
    setCart(updatedCart);
  };

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const calculateTotal = () => {
    return calculateCartTotal(cart, selectedCoupon);
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
