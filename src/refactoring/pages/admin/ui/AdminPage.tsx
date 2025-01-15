import { Coupon, Product } from '../../../../types.ts';
import { CouponManagement } from '../../../widgets/coupon/ui/CouponManagement.tsx';
import { ProductManagement } from '../../../widgets/product/ui/ProductManagement.tsx';
import { Layout } from '../../../widgets/layout/Layout.tsx';

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const AdminPage = ({
  products,
  coupons,
  onProductUpdate,
  onProductAdd,
  onCouponAdd,
}: Props) => {
  return (
    <Layout title={'관리자 페이지'}>
      <ProductManagement
        products={products}
        onProductUpdate={onProductUpdate}
        onProductAdd={onProductAdd}
      />
      <CouponManagement coupons={coupons} onCouponAdd={onCouponAdd} />
    </Layout>
  );
};
