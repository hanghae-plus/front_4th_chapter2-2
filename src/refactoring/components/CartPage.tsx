import { Coupon } from "../../types.ts";
import { useProductsContext } from "../contexts/ProductsContext.tsx";
import { useCart } from "../hooks";
import { getAppliedDiscount, getRemainingStock } from "../models/cart.ts";
import { CartItemList } from "./CartItemList.tsx";
import { CouponApplySection } from "./CouponApplySection.tsx";
import { OrderSummary } from "./OrderSummary.tsx";
import { ProductList } from "./ProductList.tsx";

interface Props {
  coupons: Coupon[];
}

export const CartPage = ({ coupons }: Props) => {
  // cart 유틸 vs cart hook -> 후자는 setState를 써서 무언가를 해야함. 그렇지 않으면 다 순수 함수로 빼도되지 않을까..??
  // 그런데 calculateTotal처럼 애매한 상황이 생길 수도 있음.. -> 내부 데이터와 깊숙히 연관되어서 다른 곳에서 떼어서 쓰기 쉽지 않은 경우? or 오히려 낭비인 경우.. ex: selectedCoupon
  // 적당히 유도리 있게 판단해야함. -> 이 판단의 기준이 뭐가 될까? 이 찝찝한 느낌을 말로 설명할 수 있으면 좋겠다...
  const { products } = useProductsContext();
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  } = useCart();
  // coupons context를 만드느냐 마느냐 그것이 문제로다. -> 거슬리지 않아서 ㄱㅊ을듯?
  // useSelectedCoupon으로 분리할 수 없음... calculateTotal 때문에.

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
          <div className="space-y-2">
            {products.map((product) => (
              // props를 데이터로만 받을 수 있다면 데이터로만 받자
              <ProductList
                key={product.id}
                remainingStock={getRemainingStock(product, cart)}
                product={product}
                onCartAdd={addToCart}
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>
          <div className="space-y-2">
            {cart.map((item, index) => (
              <CartItemList
                key={index}
                item={item}
                appliedDiscount={getAppliedDiscount(item)}
                onQuantityUpdate={updateQuantity}
                onRemoveFromCart={removeFromCart}
              />
            ))}
          </div>
          <CouponApplySection
            coupons={coupons}
            onCouponApply={applyCoupon}
            selectedCoupon={selectedCoupon}
          />
          <OrderSummary {...calculateTotal()} />
        </div>
      </div>
    </div>
  );
};
