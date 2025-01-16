import { Coupon } from "../../../types.ts";
import { AddCouponForm } from "./AddCouponForm.tsx";
import { CouponList } from "./CouponList.tsx";

interface Props {
  coupons: Coupon[];
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const CouponManagement = ({ coupons, onCouponAdd }: Props) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
      <div className="bg-white p-4 rounded shadow">
        <AddCouponForm {...{ onCouponAdd }} />
        <CouponList coupons={coupons} />
      </div>
    </div>
  );
};
