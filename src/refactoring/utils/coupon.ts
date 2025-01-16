import { Coupon } from '@/types'

export const formatCouponDiscount = (coupon: Coupon) => {
  return coupon.discountType === 'amount' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`
}

export const getCouponDisplayText = (coupon: Coupon) => {
  return `${coupon.name} - ${formatCouponDiscount(coupon)}`
}
