import { CartPage } from "./components/CartPage.tsx";
import { AdminPage } from "./components/AdminPage.tsx";
import { useCoupons, useProducts } from "./hooks";
import { initialProducts } from "./entity/products.ts";
import { initialCoupons } from "./entity/coupons.ts";
import { Navigation } from "./components/Navigation.tsx";
import { useAdmin } from "./hooks/useAdmin.ts";

const App = () => {
  // App의 관심사: products, coupons, isAdmin을 통해 모든 ui를 관리하면서 렌더링한다.
  const { products, updateProduct, addProduct } = useProducts(initialProducts);
  const { coupons, addCoupon } = useCoupons(initialCoupons);
  const { isAdmin, changeRole } = useAdmin();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation isAdmin={isAdmin} onRoleChange={changeRole} />
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
