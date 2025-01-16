import { CartPage } from "./components/CartPage.tsx";
import { AdminPage } from "./components/AdminPage.tsx";
import { useCoupons, useProducts, useToggle } from "./hooks";
import { initialProducts } from "./mock/products.ts";
import { initialCoupons } from "./mock/coupons.ts";
import NavBar from "./components/NavBar.tsx";

const App = () => {
  const { products, updateProduct, addProduct } = useProducts(initialProducts);
  const { coupons, addCoupon } = useCoupons(initialCoupons);
  const [isAdmin, toggleIsAdmin] = useToggle(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar isAdmin={isAdmin} onToggle={toggleIsAdmin} />
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
