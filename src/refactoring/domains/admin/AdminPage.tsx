import { CouponManager } from './components/coupon/CouponManager.tsx';
import { ProductManager } from './components/product/ProductManager.tsx';
import { PageContainer } from '../../shared/page-container/PageContainer.tsx';
import { Section } from '../../shared/section/Section.tsx';

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
    <PageContainer title="관리자 페이지">
      <Section title="상품 관리">
        <ProductManager {...rest} />
      </Section>
      <Section title="쿠폰 관리">
        <CouponManager coupons={coupons} onCouponAdd={onCouponAdd} />
      </Section>
    </PageContainer>
  );
};
