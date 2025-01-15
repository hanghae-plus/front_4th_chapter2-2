import { useState } from 'react';
import { CartPage } from '../pages/CartPage/CartPage.tsx';
import { AdminPage } from '../pages/AdminPage/AdminPage.tsx';
import { Coupon, Product } from '../shared/types/types.ts';
import { useCoupons, useProducts } from '../features/hooks';

// 데이터 : 상테에 대한 값을 담고 있다.
const initialProducts: Product[] = [
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

// 쿠폰 값에 대한 정보를 담고 있다.
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
  const { products, updateProduct, addProduct } = useProducts(initialProducts);
  const { coupons, addCoupon } = useCoupons(initialCoupons);

  // 어드민일때랑 아닐 때 상태 분류
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    // 전체에 대한 래퍼라고 보면 된다.
    <div className="min-h-screen bg-gray-100">
      {/* 네비 바가 하나로 분리 된다. */}
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">쇼핑몰 관리 시스템</h1>
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
          >
            {isAdmin ? '장바구니 페이지로' : '관리자 페이지로'}
          </button>
        </div>
      </nav>
      {/* 메인 로직이 따로 분리 된다. */}
      <main className="container mx-auto mt-6">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            onProductUpdate={updateProduct}
            onProductAdd={addProduct}
            onCouponAdd={addCoupon}
          />
        ) : (
          <CartPage products={products} coupons={coupons} />
        )}
      </main>
    </div>
  );
}

export default App;
