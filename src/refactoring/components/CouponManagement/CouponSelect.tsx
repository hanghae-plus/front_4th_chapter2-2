import { Coupon } from '@/types'

interface CouponSelectProps {
  coupons: Coupon[]
  selectedCoupon: Coupon | null
  onApplyCoupon: (coupon: Coupon | null) => void
}

// 쿠폰 선택 드롭다운
export const CouponSelect = ({ coupons, selectedCoupon, onApplyCoupon }: CouponSelectProps) => {
  return (
    <select
      onChange={(e) => {
        const value = e.target.value
        const selectedCoupon = value ? coupons[parseInt(value)] : null
        onApplyCoupon(selectedCoupon)
      }}
      className="w-full p-2 border rounded mb-2"
      value={selectedCoupon ? coupons.findIndex((c) => c.code === selectedCoupon.code) : ''}
    >
      <option value="">쿠폰 선택</option>
      {coupons.map((coupon, index) => (
        <option key={coupon.code} value={index}>
          {coupon.name} - {coupon.discountType === 'amount' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`}
        </option>
      ))}
    </select>
  )
}
