import { useState } from 'react';
import { CartPage } from './components/CartPage';
import { AdminPage } from './components/AdminPage';
import { Navigation } from './components/Navigation';
import { CouponType, ProductType } from '../refactoring/types';
import { useCoupons, useProducts } from './hooks';

const initialProductList: ProductType[] = [
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

const initialCouponList: CouponType[] = [
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
  const { productList, updateProduct, addProduct } = useProducts(initialProductList);
  const { coupons, addCoupon } = useCoupons(initialCouponList);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className='min-h-screen bg-gray-100'>
      <Navigation
        buttonText={isAdmin ? '장바구니 페이지로' : '관리자 페이지로'}
        onClick={() => setIsAdmin((prev) => !prev)}
      />
      <main className='container mx-auto mt-6'>
        {isAdmin ? (
          <AdminPage
            productList={productList}
            coupons={coupons}
            onProductUpdate={updateProduct}
            onProductAdd={addProduct}
            onCouponAdd={addCoupon}
          />
        ) : (
          <CartPage productList={productList} coupons={coupons} />
        )}
      </main>
    </div>
  );
};

export default App;
