import { CouponManager } from './components/coupon/CouponManager.tsx';
import { ProductManager } from './components/product/ProductManager.tsx';

import type { Coupon, Product } from '../../../types.ts';
import type { PropsWithChildren } from 'react';

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
        <Section title="상품 관리">
          <ProductManager {...rest} />
        </Section>
        <Section title="쿠폰 관리">
          <CouponManager coupons={coupons} onCouponAdd={onCouponAdd} />
        </Section>
      </div>
    </div>
  );
};

const Section = ({ title, children }: PropsWithChildren<{ title: string }>) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
};
