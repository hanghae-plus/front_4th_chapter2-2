import { useState } from "react";
import { CartPage } from "./components/CartPage.tsx";
import { AdminPage } from './components/AdminPage.tsx';
import { useCoupons, useProducts, useDarkMode, useFontSize } from "./hooks";
import { initialProducts, initialCoupons } from "./data/initialData";


const App = () => {
  const { products, updateProduct, addProduct } = useProducts(initialProducts);
  const { coupons, addCoupon } = useCoupons(initialCoupons);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { fontSize, increaseFontSize, decreaseFontSize } = useFontSize();

  // 초기 글자 크기 설정
  document.documentElement.style.fontSize = `${fontSize}px`;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center gap-2">
          <h1 className="text-2xl font-bold max-sm:text-base">쇼핑몰 관리 시스템</h1>

          <div className="flex gap-2">
            <button
              onClick={increaseFontSize}
              className="bg-white text-blue-600 px-2 py-1 rounded hover:bg-blue-100 max-sm:text-xs max-sm:px-1 max-sm:py-1"
              title="확대"
            >
              +
            </button>
            <button
              onClick={decreaseFontSize}
              className="bg-white text-blue-600 px-2 py-1 rounded hover:bg-blue-100 max-sm:text-xs max-sm:px-1 max-sm:py-1"
              title="축소"
            >
              -
            </button>
            <button
              className="bg-white text-blue-600 px-2 py-1 rounded hover:bg-blue-100 max-sm:text-xs max-sm:px-1 max-sm:py-1"
              title="색상변경"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? "라이트 모드로 변경" : "다크 모드로 변경"}
            </button>
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-blue-100 max-sm:text-xs max-sm:px-2 max-sm:py-1"
            >
              {isAdmin ? '장바구니 페이지로' : '관리자 페이지로'}
            </button>
          </div>

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
