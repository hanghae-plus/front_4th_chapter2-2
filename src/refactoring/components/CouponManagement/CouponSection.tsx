import { Coupon } from '@/types'
import { CouponSelect } from './CouponSelect'
import { CouponDisplay } from './CouponDisplay'

interface CouponSectionProps {
  coupons: Coupon[]
  selectedCoupon: Coupon | null
  onApplyCoupon: (coupon: Coupon | null) => void
}

// 쿠폰 적용 섹션
export const CouponSection = ({ coupons, selectedCoupon, onApplyCoupon }: CouponSectionProps) => {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">쿠폰 적용</h2>
      <CouponSelect coupons={coupons} selectedCoupon={selectedCoupon} onApplyCoupon={onApplyCoupon} />
      <CouponDisplay selectedCoupon={selectedCoupon} />
    </div>
  )
}
