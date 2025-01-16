import { useState, useMemo } from "react";

import { initialProducts, initialCoupons } from "./constants/initialData";
import { useCoupons, useProducts } from "./hooks";
import { Layout, Navigation } from "./components/Shared";
import { AdminPage } from "./components/Admin";
import { CartPage } from "./components/Cart";

const App = () => {
  const { products, updateProduct, addProduct } = useProducts(initialProducts);
  const { coupons, addCoupon } = useCoupons(initialCoupons);

  const [isAdmin, setIsAdmin] = useState(false);

  const pageProps = useMemo(
    () => ({
      products,
      coupons,
      onProductUpdate: updateProduct,
      onProductAdd: addProduct,
      onCouponAdd: addCoupon,
    }),
    [products, coupons, updateProduct, addProduct, addCoupon]
  );

  const currentPage = useMemo(() => {
    if (isAdmin) {
      return <AdminPage {...pageProps} />;
    }
    return <CartPage products={products} coupons={coupons} />;
  }, [isAdmin, pageProps]);

  const toggleAdmin = () => setIsAdmin((prev) => !prev);

  return (
    <Layout>
      <Navigation isAdmin={isAdmin} onToggle={toggleAdmin} />
      <main className="container mx-auto mt-6">{currentPage}</main>
    </Layout>
  );
};

export default App;
