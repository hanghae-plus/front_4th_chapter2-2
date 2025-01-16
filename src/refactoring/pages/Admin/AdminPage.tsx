import { CouponManagement } from '@/refactoring/pages/Admin/CouponManagement';
import { ProductManagement } from '@/refactoring/pages/Admin/ProductManagement';
import type { Coupon, Product } from '@/types';

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const AdminPage = ({ products, coupons, onProductUpdate, onProductAdd, onCouponAdd }: Props) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">관리자 페이지</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ProductManagement products={products} onProductAdd={onProductAdd} onProductUpdate={onProductUpdate} />
        <CouponManagement coupons={coupons} onCouponAdd={onCouponAdd} />
      </div>
    </div>
  );
};
