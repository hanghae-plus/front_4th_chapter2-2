import { useCallback } from 'react'
import { CartItem, Coupon } from '@/types'
import { calculateCartTotal } from '../utils/cart'

// 장바구니 총 금액 계산
export const useCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const calculateTotal = useCallback(() => {
    return calculateCartTotal(cart, selectedCoupon)
  }, [cart, selectedCoupon])

  return calculateTotal
}
