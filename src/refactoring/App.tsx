import { useState } from 'react';
import { CartPage } from './components/CartPage.tsx';
import { AdminPage } from './components/AdminPage.tsx';
import { useCoupons, useProducts } from './hooks';
import { initialProductList, initialCouponList } from './data/initialData.ts';
import { Header } from './components/Header.tsx';

const App = () => {
  const { products, updateProduct, addProduct } =
    useProducts(initialProductList);
  const { coupons, addCoupon } = useCoupons(initialCouponList);
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
