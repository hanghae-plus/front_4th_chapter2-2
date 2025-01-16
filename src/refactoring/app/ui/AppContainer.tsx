import { ReactNode } from 'react';
import { Coupon, Product } from '../../../types';
import { ProductProvider } from '../../features/product/lib/context';
import { CouponProvider } from '../../features/coupon/lib/context';

interface AppContainerProps {
  children: ReactNode;
  initialProducts: Product[];
  initialCoupons: Coupon[];
}

export function AppContainer({ children, initialProducts, initialCoupons }: AppContainerProps) {
  return (
    <ProductProvider initialProducts={initialProducts}>
      <CouponProvider initialCoupons={initialCoupons}>{children}</CouponProvider>
    </ProductProvider>
  );
}
