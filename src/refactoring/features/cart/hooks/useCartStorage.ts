import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { CartItem, Coupon } from '../../../../types';

export const useCartStorage = () => {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [selectedCoupon, setSelectedCoupon] = useLocalStorage<Coupon | null>('selectedCoupon', null);

  return {
    cart,
    setCart,
    selectedCoupon,
    setSelectedCoupon,
  };
};
