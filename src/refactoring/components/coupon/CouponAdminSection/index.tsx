import { Coupon } from "../../../../types";
import useAdminCoupon from "../../../hooks/useAdminCoupon";
import CouponAddForm from "./fragments/CouponAddForm";
import CouponAdminList from "./fragments/CouponAdminList";

interface CouponAdminSectionProps {
  onCouponAdd: (newCoupon: Coupon) => void;
  coupons: Coupon[];
}

function CouponAdminSection(props: CouponAdminSectionProps) {
  const { onCouponAdd, coupons } = props;

  const { newCoupon, setNewCoupon, handleAddCoupon } = useAdminCoupon({
    onCouponAdd,
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
      <div className="bg-white p-4 rounded shadow">
        <CouponAddForm
          newCoupon={newCoupon}
          setNewCoupon={setNewCoupon}
          handleAddCoupon={handleAddCoupon}
        />
        <CouponAdminList coupons={coupons} />
      </div>
    </div>
  );
}

export default CouponAdminSection;
