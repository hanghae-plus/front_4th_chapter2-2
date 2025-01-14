import { useState } from "react";
import { CartPage } from "./pages/CartPage.tsx";
import { AdminPage } from "./pages/AdminPage.tsx";
import { Product } from "../types.ts";
import { useProducts } from "./hooks";
import Navigation from "./components/Navigation.tsx";

const initialProducts: Product[] = [
  {
    id: "p1",
    name: "상품1",
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
  },
  {
    id: "p2",
    name: "상품2",
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: "p3",
    name: "상품3",
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
];

const App = () => {
  const { products, updateProduct, addProduct } = useProducts(initialProducts);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation
        onClick={() => setIsAdmin(!isAdmin)}
        buttonValue={isAdmin ? "장바구니 페이지로" : "관리자 페이지로"}
      />
      <main className="container mx-auto mt-6">
        {isAdmin ? (
          <AdminPage
            products={products}
            onProductUpdate={updateProduct}
            onProductAdd={addProduct}
          />
        ) : (
          <CartPage products={products} />
        )}
      </main>
    </div>
  );
};

export default App;
