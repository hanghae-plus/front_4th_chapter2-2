import { useState } from "react";
import { CartPage } from "./components/CartPage.tsx";
import { AdminPage } from "./components/AdminPage.tsx";
import { useCoupons, useProduct } from "./hooks";

const App = () => {
  const { products, handleEditProduct, handleAddProduct } = useProduct();
  const { coupons, handleCouponAdd } = useCoupons();
  const [isAdmin, setIsAdmin] = useState(false);

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
            onProductUpdate={handleEditProduct}
            onProductAdd={handleAddProduct}
            onCouponAdd={handleCouponAdd}
          />
        ) : (
          <CartPage products={products} coupons={coupons} />
        )}
      </main>
    </div>
  );
};

export default App;

/**
 * TODO: 여기에서 custom hook과 util 함수를 적절하게 분리하고, 테스트 코드를 통과할 수 있도록 해주세요.
 */
