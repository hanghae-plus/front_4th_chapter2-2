import { Coupon, Product } from "../../types.ts";
import { useCart } from "../hooks";
import { getRemainingStock } from "../service/getRemainingStock.ts";
import { ProductListItem } from "./ProductListItem/ProductListItem.tsx";
import { CartProduct } from "./CartProduct/CartProduct.tsx";
import { CouponSelecter } from "./CouponSelecter/CouponSelecter.tsx";
import { OrderSummary } from "./OrderSummary/OrderSummary.tsx";

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

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
    calculateTotal();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
          <div className="space-y-2">
            {products.map((product) => {
              const remainingStock = getRemainingStock(cart, product);
              return (
                <ProductListItem
                  product={product}
                  remainingStock={remainingStock}
                  addToCart={addToCart}
                />
              );
            })}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>

          <div className="space-y-2">
            {cart.map((item) => (
              <CartProduct
                item={item}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            ))}
          </div>

          <CouponSelecter
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            applyCoupon={applyCoupon}
          />

          <OrderSummary
            totalBeforeDiscount={totalBeforeDiscount}
            totalDiscount={totalDiscount}
            totalAfterDiscount={totalAfterDiscount}
          />
        </div>
      </div>
    </div>
  );
};
