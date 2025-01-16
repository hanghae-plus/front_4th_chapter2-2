import { useState } from 'react';
import { CartPage } from '@/pages/CartPage';
import { AdminPage } from '@/pages/AdminPage';
import { initialProducts, useProducts } from '@/entities/product';
import { initialCoupons, useCoupons } from '@/entities/coupon';
import { Header } from '@/shared/ui';

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
          <Header className="text-2xl font-bold">쇼핑몰 관리 시스템</Header>
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
