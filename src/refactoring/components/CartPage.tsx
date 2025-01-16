import { Coupon, Product } from '../../types.ts';
import { useCart } from "../hooks/index.ts";
import { ProductList } from "./cart/ProductList.tsx";
import { CartCouponsList } from "./cart/CartCouponsList.tsx";


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
    selectedCoupon
  } = useCart();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/*상품 목록*/}
        <ProductList products={products} cart={cart} addToCart={addToCart} />

        {/*장바구니내역, 쿠폰 적용, 금액표시*/}
        <CartCouponsList
          coupons={coupons}
          cart={cart}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          applyCoupon={applyCoupon}
          calculateTotal={calculateTotal}
          selectedCoupon={selectedCoupon}
        />
      </div>
    </div>
  );
};
