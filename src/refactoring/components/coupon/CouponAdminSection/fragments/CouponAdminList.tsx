import { Coupon } from "../../../../../types";
import CouponAdminItem from "./CouponAdminItem";

interface CouponAdminListProps {
  coupons: Coupon[];
}

function CouponAdminList(props: CouponAdminListProps) {
  const { coupons } = props;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
      <div className="space-y-2">
        {coupons.map((coupon, index) => (
          <CouponAdminItem key={index} coupon={coupon} index={index} />
        ))}
      </div>
    </div>
  );
}

export default CouponAdminList;
