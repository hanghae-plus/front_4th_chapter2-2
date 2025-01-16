import { useLocalStorage } from '@/refactoring/hooks';
import { calculateCartTotal, updateCartItemQuantity } from '@/refactoring/pages/Cart/model/cart';
import type { CartItem, Coupon, Product } from '@/types';

export const useCartLocalStorage = () => {
  const [cart, setCart] = useLocalStorage<CartItem[]>({ key: 'cart', initialValue: [] });
  const [selectedCoupon, setSelectedCoupon] = useLocalStorage<Coupon | null>({
    key: 'selectedCoupon',
    initialValue: null
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(updateCartItemQuantity(cart, product.id, existingItem.quantity + 1));
      return;
    }

    setCart([...cart, { product, quantity: 1 }]);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart(updateCartItemQuantity(cart, productId, newQuantity));
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
    selectedCoupon
  };
};
