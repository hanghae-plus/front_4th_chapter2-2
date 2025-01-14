import { useState } from "react";
import { Coupon } from "../../../../types";
import CouponList from "./CouponList";
import CouponForm from "./CouponForm";

interface CouponContainerProps {
  coupons: Array<Coupon>;
  onAddCoupon: (coupon: Coupon) => void;
}

const CouponContainer = ({ coupons, onAddCoupon }: CouponContainerProps) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: "",
    code: "",
    discountType: "percentage",
    discountValue: 0,
  });

  const handleSubmit = () => {
    onAddCoupon(newCoupon);
    setNewCoupon({
      name: "",
      code: "",
      discountType: "percentage",
      discountValue: 0,
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <CouponForm
        coupon={newCoupon}
        onChange={setNewCoupon}
        onSubmit={handleSubmit}
      />
      <CouponList coupons={coupons} />
    </div>
  );
};

export default CouponContainer;
