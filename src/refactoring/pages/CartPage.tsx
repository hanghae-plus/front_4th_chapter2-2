import { Coupon, Product } from "../../types.ts";
import { useCart, useProductSearch } from "../hooks";
import {
  SelectCoupon,
  OrderSummary,
  SearchProductBar,
  CartList,
  ProductList,
} from "../components/cart";

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
