import { useState, useEffect } from "react";
import { CartPage } from "./components/CartPage.tsx";
import { AdminPage } from "./components/AdminPage.tsx";

import { useCoupons, useProducts } from "./hooks";
import { Coupon, Product } from "./models/index.ts";
import { config } from "./config";
import { initialProducts, initialCoupons } from "./mocks/data";
import { productService, couponService } from "./services";

const App = () => {
  const { products, updateProduct, addProduct } = useProducts(initialProducts);
  const { coupons, addCoupon } = useCoupons(initialCoupons);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (config.isApiMockMode) {
      // 상품 데이터 불러오기
      productService
        .getProducts()
        .then((data) => {
          console.log("Fetched products:", data);
        })
        .catch((error) => {
          console.error("Failed to fetch products:", error);
        });

      // 쿠폰 데이터 불러오기
      couponService
        .getCoupons()
        .then((data) => {
          console.log("Fetched coupons:", data);
        })
        .catch((error) => {
          console.error("Failed to fetch coupons:", error);
        });
    }
  }, []);

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
