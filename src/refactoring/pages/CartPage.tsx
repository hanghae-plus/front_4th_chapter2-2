import { Coupon, Grade, Product } from "../../types.ts";
import CartList from "../components/cart/CartList.tsx";
import CartSummary from "../components/cart/CartSummary.tsx";
import CouponApply from "../components/coupon/CouponApply.tsx";
import GradeApply from "../components/grade/GradeApply.tsx";
import ProductList from "../components/product/ProductList.tsx";
import { useCart } from "../hooks/index.ts";

interface Props {
  products: Product[];
  coupons: Coupon[];
  grades: Grade[];
}

export const CartPage = (props: Props) => {
  const { products, coupons, grades } = props;

  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
    applyGrade,
    selectedGrade,
  } = useCart();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <ProductList products={products} addToCart={addToCart} cart={cart} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>

          <CartList
            cart={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />

          <CouponApply
            coupons={coupons}
            applyCoupon={applyCoupon}
            selectedCoupon={selectedCoupon}
          />

          <GradeApply
            grades={grades}
            applyGrade={applyGrade}
            selectedGrade={selectedGrade}
          />

          <CartSummary calculateTotal={calculateTotal} />
        </div>
      </div>
    </div>
  );
};
