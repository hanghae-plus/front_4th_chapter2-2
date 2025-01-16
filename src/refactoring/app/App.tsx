import { useState } from 'react';
import { CartPage } from '../pages/cart/ui/CartPage.tsx';
import { AdminPage } from '../pages/admin/ui/AdminPage.tsx';
import { Layout } from './Layout.tsx';
import { ProductContextProvider } from './providers/ProductContextProvider.tsx';
import { CouponContextProvider } from './providers';
import { ICoupon, IProduct } from '../shared/types';

const initialProducts: IProduct[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
];

const initialCoupons: ICoupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <ProductContextProvider initialProducts={initialProducts}>
      <CouponContextProvider initialCoupons={initialCoupons}>
        <Layout isAdmin={isAdmin} setIsAdmin={setIsAdmin}>
          {isAdmin ? <AdminPage /> : <CartPage />}
        </Layout>
      </CouponContextProvider>
    </ProductContextProvider>
  );
};

export default App;
