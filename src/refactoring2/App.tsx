import { useState } from 'react';
import { Coupon, Membership, Product } from '../types.ts';
import { AdminPage } from './components/AdminPage.tsx';
import { CartPage } from './components/CartPage.tsx';
import { useCoupons } from './hooks/useCoupon.ts';
import { useMemberships } from './hooks/useMembership.ts';
import { useProducts } from './hooks/useProducts.ts';

const initialProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
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

const initialMemberships: Membership[] = [
  {
    name: '브론즈 등급 할인',
    code: 'BRONZE',
    discountType: 'percentage',
    discountValue: 3,
  },
  {
    name: '실버 등급 할인',
    code: 'SILVER',
    discountType: 'percentage',
    discountValue: 5,
  },
  {
    name: '골드 등급 할인',
    code: 'GOLD',
    discountType: 'percentage',
    discountValue: 7,
  },
  {
    name: 'VIP 등급 할인',
    code: 'VIP',
    discountType: 'percentage',
    discountValue: 10,
  },
];

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

const App = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts(initialProducts);
  const { memberships, addMembership } = useMemberships(initialMemberships);
  const { coupons, addCoupon } = useCoupons(initialCoupons);

  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4 text-white">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">쇼핑몰 관리 시스템</h1>
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className="rounded bg-white px-4 py-2 text-blue-600 hover:bg-blue-100"
          >
            {isAdmin ? '장바구니 페이지로' : '관리자 페이지로'}
          </button>
        </div>
      </nav>
      <main className="container mx-auto mt-6">
        {isAdmin ? (
          <AdminPage
            products={products}
            memberships={memberships}
            coupons={coupons}
            onProductAdd={addProduct}
            onProductUpdate={updateProduct}
            onProductDelete={deleteProduct}
            onMembershipAdd={addMembership}
            onCouponAdd={addCoupon}
          />
        ) : (
          <CartPage products={products} memberships={memberships} coupons={coupons} />
        )}
      </main>
    </div>
  );
};

export default App;
