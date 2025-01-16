import { ReactNode } from 'react';
import { Coupon, Product } from '../../../types';
import { ProductProvider } from '../../entities/product/provider/ProductProvider';
import { CouponProvider } from '../../entities/coupon/ui/CouponProvider';

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
