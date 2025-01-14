import { Coupon } from '@/types'
import { CouponForm } from './CouponForm'
import { CouponList } from './CouponList'

interface CouponManagementProps {
  coupons: Coupon[]
  onCouponAdd: (newCoupon: Coupon) => void
}

export const CouponManagement = ({ coupons, onCouponAdd }: CouponManagementProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
      <div className="bg-white p-4 rounded shadow">
        <CouponForm onSubmit={onCouponAdd} />
        <CouponList coupons={coupons} />
      </div>
    </div>
  )
}
