import { useCart } from "../hooks";
import { CartList } from "./carts/CartList.tsx";
import { CartProduct } from "./carts/CartProduct.tsx";
import { Coupon, Product } from "../../types.ts";

interface Props {
  coupons: Coupon[];
  products: Product[];
}

export const CartPage = ({coupons, products}: Props) => {
  const {
    cart,
    selectedCoupon,
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
    applyCoupon,
    addToCart,
    removeFromCart, 
    updateQuantity,
    getRemainingStock
  } = useCart();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
          <div className="space-y-2">
            {products.map((product) => 
              <CartList 
                key={product.id} 
                product={product} 
                addToCart={addToCart} 
                getRemainingStock={getRemainingStock}
              />
            )}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>
          <div className="space-y-2">
            {cart.map(item => 
              <CartProduct 
                item={item} 
                key={item.product.id} 
                onUpdateQuantity={updateQuantity}
                onRemoveFromCart={removeFromCart}
              />
            )}
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
                  {coupon.name} - {coupon.discountType === 'amount' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`}
                </option>
              ))}
            </select>
            {selectedCoupon && (
              <p className="text-green-600">
                적용된 쿠폰: {selectedCoupon.name}
                ({selectedCoupon.discountType === 'amount' ? `${selectedCoupon.discountValue}원` : `${selectedCoupon.discountValue}%`} 할인)
              </p>
            )}
          </div>

          <div className="mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">주문 요약</h2>
            <div className="space-y-1">
              <p>상품 금액: {totalBeforeDiscount.toLocaleString()}원</p>
              <p className="text-green-600">할인 금액: {totalDiscount.toLocaleString()}원</p>
              <p className="text-xl font-bold">
                최종 결제 금액: {totalAfterDiscount.toLocaleString()}원
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
