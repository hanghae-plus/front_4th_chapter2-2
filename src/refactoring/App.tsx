import { useState } from 'react';

import { Coupon, Product } from '../types.ts';
import { Header } from './components/Header.tsx';
import { initialCoupons } from './data/coupon.ts';
import { initialProducts } from './data/product.ts';
import { AdminPage } from './pages/AdminPage.tsx';
import { CartPage } from './pages/CartPage.tsx';
import { useCoupons } from './features/coupon/hooks/useCoupon.ts';
import { useProducts } from './features/product/hooks/useProduct.ts';

const App = () => {
  const { products, updateProduct, addProduct } = useProducts(initialProducts);
  const { coupons, addCoupon } = useCoupons(initialCoupons);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header isAdmin={isAdmin} onToggleAdmin={() => setIsAdmin(!isAdmin)} />
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
};

export default App;
