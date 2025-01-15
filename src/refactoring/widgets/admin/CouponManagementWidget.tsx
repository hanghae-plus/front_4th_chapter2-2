import AddCoupon from '../../features/coupons/admin/AddCoupon';
import CouponList from '../../features/coupons/admin/CouponList';

function CouponManagementWidget() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
      <div className="bg-white p-4 rounded shadow">
        <AddCoupon />
        <CouponList />
      </div>
    </div>
  );
}

export default CouponManagementWidget;
