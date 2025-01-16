import { useState } from "react";
import { CartPage } from "./pages/CartPage";
import { AdminPage } from "./pages/AdminPage";
import { useCoupons, useProducts } from "./hooks";
import { initialCoupons, initialProducts } from "./constants/initialValues";
import PageLayout from "./components/layout/PageLayout";

const App = () => {
  const [isViewingAdminPage, setIsViewingAdminPage] = useState(false);

  const { products, updateProduct, addProduct } = useProducts(initialProducts);
  const { coupons, addCoupon } = useCoupons(initialCoupons);

  const toggleAdminPage = () => {
    setIsViewingAdminPage((prevState) => !prevState);
  };

  return (
    <PageLayout
      actions={
        <button
          onClick={toggleAdminPage}
          className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
        >
          {isViewingAdminPage ? "장바구니 페이지로" : "관리자 페이지로"}
        </button>
      }
    >
      {isViewingAdminPage ? (
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
    </PageLayout>
  );
};

export default App;
