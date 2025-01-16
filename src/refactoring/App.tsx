import { useState } from "react";
import { CartPage } from "./components/CartPage.tsx";
import { AdminPage } from "./components/AdminPage.tsx";
import { useCoupons, useProducts } from "./hooks";
import { initialProducts, initialCoupons } from "./mocks/data";

import { useProductsAPI } from "./hooks/api/useProductsAPI";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { products, addProduct, updateProduct, deleteProduct } =
    useProductsAPI();
  const { coupons, addCoupon } = useCoupons(initialCoupons);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">쇼핑몰 관리 시스템</h1>
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
          >
            {isAdmin ? "장바구니 페이지로" : "관리자 페이지로"}
          </button>
        </div>
      </nav>
      <main className="container mx-auto mt-6">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            onProductUpdate={(product) =>
              updateProduct({ id: product.id, product })
            }
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
