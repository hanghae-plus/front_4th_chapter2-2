import { Coupon, Product } from "../../types.ts";
import { useCart } from "../hooks";
import { ProductList } from "../components/cart";
import { CartList } from "../components/cart";
import { SelectCoupon } from "../components/cart";
import { OrderSummary } from "../components/cart";
import { useProductSearch } from "../hooks/useProductSearch.ts";
import { SearchProductBar } from "../components/cart/SearchProduct.tsx";

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  } = useCart();
  const { filteredProducts, handleSearch } = useProductSearch(products);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <SearchProductBar onChange={handleSearch} />
          <ProductList {...{ products: filteredProducts, cart, addToCart }} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>
          <CartList {...{ cart, updateQuantity, removeFromCart }} />
          <SelectCoupon {...{ coupons, applyCoupon, selectedCoupon }} />
          <OrderSummary calculateTotal={calculateTotal} />
        </div>
      </div>
    </div>
  );
};
