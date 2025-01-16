import { useCoupons } from '../../../../hooks';
import { CouponAddButton } from './CouponAddButton';
import { CouponAddInput } from './CouponAddInput';

export const CouponAddForm = () => {
  const { newCoupon, updateCoupon, handleNewCoupon } = useCoupons();
  return (
    <div className="space-y-2 mb-4">
      <CouponAddInput newCoupon={newCoupon} handleNewCoupon={handleNewCoupon} />
      <CouponAddButton onClick={updateCoupon} />
    </div>
  );
};
