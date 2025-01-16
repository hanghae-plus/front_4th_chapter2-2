import { CartItem, Coupon, Product } from '../../../../types';
import { calculateCartTotal, updateCartItemQuantity } from '../helpers';
import { useCartStorage } from './useCartStorage';

export const useCart = () => {
  const { cart, setCart, selectedCoupon, setSelectedCoupon } = useCartStorage();

  const addToCart = (product: Product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return updateCartItemQuantity(currentCart, product.id, existingItem.quantity + 1);
      } else {
        return [...currentCart, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((currentCart) => updateCartItemQuantity(currentCart, productId, newQuantity));
  };

  const applyCoupon = (coupon: Coupon | null) => {
    if (!coupon) return;
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
