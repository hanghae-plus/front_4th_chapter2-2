import { Coupon } from "../../../../types";
import CouponList from "./CouponList";
import CouponForm from "./CouponForm";

interface CouponContainerProps {
  coupons: Array<Coupon>;
  onAddCoupon: (coupon: Coupon) => void;
}

const CouponContainer = ({ coupons, onAddCoupon }: CouponContainerProps) => {
  const handleSubmit = (addCoupon: Coupon) => {
    onAddCoupon(addCoupon);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <CouponForm onSubmit={handleSubmit} />
      <CouponList coupons={coupons} />
    </div>
  );
};

export default CouponContainer;
