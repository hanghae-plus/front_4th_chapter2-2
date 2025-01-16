import { CouponAddForm } from "./couponAddForm/CouponAddForm";
import { CouponList } from "./couponList/CouponList";

export const CouponManagement = () => {
  return (
    <div>
      <div className="bg-white p-4 rounded shadow">
        <CouponAddForm />
        <CouponList />
      </div>
    </div>
  );
};
