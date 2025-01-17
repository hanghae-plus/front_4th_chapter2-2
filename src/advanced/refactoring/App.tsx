import React, { useEffect, useState } from 'react';
import CartPage from './components/CartPage.tsx';
import AdminPage from './components/AdminPage.tsx';
import { useCoupons, useProducts } from './hooks/index.ts';
import { Coupon } from './models/types/Coupon.ts';
import { getProducts } from './models/api/getProducts.ts';

const initialCoupons: Coupon[] = [
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

function App() {
  const { coupons, addCoupon } = useCoupons(initialCoupons);
  const [isAdmin, setIsAdmin] = useState(false);
  const { products, setProducts } = useProducts();

  useEffect(() => {
    if (products.length) return;
    getProducts().then(setProducts);
  }, [products, setProducts]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">쇼핑몰 관리 시스템</h1>
          <button
            type="button"
            onClick={() => setIsAdmin(!isAdmin)}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
          >
            {isAdmin ? '장바구니 페이지로' : '관리자 페이지로'}
          </button>
        </div>
      </nav>

      <main className="container mx-auto mt-6">
        {isAdmin ? (
          <AdminPage coupons={coupons} onCouponAdd={addCoupon} />
        ) : (
          <CartPage coupons={coupons} />
        )}
      </main>
    </div>
  );
}

export default App;
