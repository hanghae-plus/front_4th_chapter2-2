import { Coupon } from '@/types'

interface CouponDisplayProps {
  selectedCoupon: Coupon | null
}

// 선택된 쿠폰 정보 표시
export const CouponDisplay = ({ selectedCoupon }: CouponDisplayProps) => {
  if (!selectedCoupon) return null

  return (
    <p className="text-green-600">
      적용된 쿠폰: {selectedCoupon.name}(
      {selectedCoupon.discountType === 'amount'
        ? `${selectedCoupon.discountValue}원`
        : `${selectedCoupon.discountValue}%`}{' '}
      할인)
    </p>
  )
}
