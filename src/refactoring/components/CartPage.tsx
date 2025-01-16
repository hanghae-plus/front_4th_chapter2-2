import { CartItem, Coupon, Product } from "../../types.ts";
import { useCart, useLocalStorage } from "../hooks";
import CartItemDisplay from "./carts/CartItemDisplay.tsx";
import OrderSummary from "./carts/OrderSummary.tsx";
import ApplyCoupon from "./carts/ApplyCoupon.tsx";
import ProductList from "./carts/ProductList.tsx";

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

  const getRemainingStock = (product: Product) => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };

  const getAppliedDiscount = (item: CartItem) => {
    return item.product.discounts.reduce(
      (maxDiscount, discount) =>
        item.quantity >= discount.quantity
          ? Math.max(maxDiscount, discount.rate)
          : maxDiscount,
      0
    );
  };

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
    calculateTotal();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
          <ProductList
            products={products}
            addToCart={addToCart}
            getRemainingStock={getRemainingStock}
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>
          <div className="space-y-2">
            {cart.map((item) => {
              const appliedDiscount = getAppliedDiscount(item);
              return (
                <CartItemDisplay
                  key={item.product.id}
                  item={item}
                  appliedDiscount={appliedDiscount}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              );
            })}
          </div>
          <ApplyCoupon
            coupons={coupons}
            applyCoupon={applyCoupon}
            selectedCoupon={selectedCoupon}
          />
          <OrderSummary
            totalAfterDiscount={totalAfterDiscount}
            totalBeforeDiscount={totalBeforeDiscount}
            totalDiscount={totalDiscount}
          />
        </div>
      </div>
    </div>
  );
};
