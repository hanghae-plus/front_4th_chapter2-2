import { CouponManager } from './components/coupon/CouponManager.tsx';
import { ProductManager } from './components/product/ProductManager.tsx';

import type { Coupon, Product } from '../../../types.ts';

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const AdminPage = ({ coupons, onCouponAdd, ...rest }: Props) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductManager {...rest} />
        <CouponManager coupons={coupons} onCouponAdd={onCouponAdd} />
      </div>
    </div>
  );
};
