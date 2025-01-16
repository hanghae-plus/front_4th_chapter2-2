import { useState } from 'react';
import { AdminPage } from './components/AdminPage.tsx';
import { CartPage } from './components/CartPage.tsx';
import { useCoupons } from './hooks/useCoupon.ts';
import { useMemberships } from './hooks/useMembership.ts';
import { useProducts } from './hooks/useProducts.ts';

const App = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { memberships, addMembership } = useMemberships();
  const { coupons, addCoupon } = useCoupons();

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
