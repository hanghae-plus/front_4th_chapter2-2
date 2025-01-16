import { CouponManagement } from '../../../widgets/coupon/ui/CouponManagement.tsx';
import { ProductManagement } from '../../../widgets/product/ui/ProductManagement.tsx';

export const AdminPage = () => {
  return (
    <>
      <ProductManagement />
      <CouponManagement />
    </>
  );
};
