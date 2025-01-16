import { Coupon, Product } from '../../types.ts';
import { CouponManageSection } from './admin-page/CouponManageSection.tsx';
import { ProductManageSection } from './admin-page/ProductManageSection.tsx';
import { Container } from './templates/Container.tsx';
import { Title } from './templates/Title.tsx';

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
    <Container>
      <Title level={1}>관리자 페이지</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductManageSection
          products={products}
          onProductUpdate={onProductUpdate}
          onProductAdd={onProductAdd}
        />
        <CouponManageSection
          products={products}
          coupons={coupons}
          onProductUpdate={onProductUpdate}
          onProductAdd={onProductAdd}
          onCouponAdd={onCouponAdd}
        />
      </div>
    </Container>
  );
};
