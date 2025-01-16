import { useCartItems } from './useCartItems'
import { useCartCoupon } from './useSelectedCartCoupon'
import { useCartTotal } from './useCartTotal'

// 장바구니 관리
export const useCart = () => {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCartItems()
  const { selectedCoupon, applyCoupon } = useCartCoupon()
  const calculateTotal = useCartTotal(cart, selectedCoupon)

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    selectedCoupon,
    applyCoupon,
    calculateTotal,
  }
}
