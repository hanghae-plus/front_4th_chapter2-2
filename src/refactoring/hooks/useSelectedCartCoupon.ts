import { useCallback } from 'react'
import { Coupon } from '@/types'
import { useLocalStorage } from './useLocalStorage'

// 장바구니 쿠폰 선택
export const useCartCoupon = () => {
  const [selectedCoupon, setSelectedCoupon] = useLocalStorage<Coupon | null>({
    key: 'selectedCartCoupon',
    initialValue: null,
  })

  const applyCoupon = useCallback((coupon: Coupon | null) => {
    setSelectedCoupon(coupon)
  }, [])

  return {
    selectedCoupon,
    applyCoupon,
  }
}