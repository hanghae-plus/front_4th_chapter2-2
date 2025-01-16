import { CartItem, Coupon, Product } from "../../types.ts";
import { useCart, useLocalStorage } from "../hooks";
import CartItemDisplay from "./carts/CartItemDisplay.tsx";
import DiscountInfo from "./carts/DiscountInfo.tsx";
import ProductPrice from "./carts/ProductPrice.tsx";
import OrderSummary from "./carts/OrderSummary.tsx";

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
          <div className="space-y-2">
            {products.map((product) => {
              const remainingStock = getRemainingStock(product);
              return (
                <div
                  key={product.id}
                  data-testid={`product-${product.id}`}
                  className="bg-white p-3 rounded shadow"
                >
                  <ProductPrice
                    product={product}
                    remainingStock={remainingStock}
                  />
                  <DiscountInfo product={product} />
                  <button
                    onClick={() => addToCart(product)}
                    className={`w-full px-3 py-1 rounded ${
                      remainingStock > 0
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={remainingStock <= 0}
                  >
                    {remainingStock > 0 ? "장바구니에 추가" : "품절"}
                  </button>
                </div>
              );
            })}
          </div>
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

          <div className="mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">쿠폰 적용</h2>
            <select
              onChange={(e) => applyCoupon(coupons[parseInt(e.target.value)])}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="">쿠폰 선택</option>
              {coupons.map((coupon, index) => (
                <option key={coupon.code} value={index}>
                  {coupon.name} -{" "}
                  {coupon.discountType === "amount"
                    ? `${coupon.discountValue}원`
                    : `${coupon.discountValue}%`}
                </option>
              ))}
            </select>
            {selectedCoupon && (
              <p className="text-green-600">
                적용된 쿠폰: {selectedCoupon.name}(
                {selectedCoupon.discountType === "amount"
                  ? `${selectedCoupon.discountValue}원`
                  : `${selectedCoupon.discountValue}%`}{" "}
                할인)
              </p>
            )}
          </div>
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
