import { Coupon, Product } from "../../types.ts";
import { useCart } from "../hooks";
import PageContainer from "../components/shared/PageContainer.tsx";
import CartSection from "../components/cart/CartSection.tsx";
import ProductList from "../components/cart/ProductList.tsx";
import ItemList from "../components/cart/ItemList.tsx";
import DetailInfoCard from "../components/cart/DetailInfoCard.tsx";

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    getAppliedDiscount,
    getRemainingStock,
    getMaxDiscount,
    addToCart,
    selectedCoupon,
  } = useCart();

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
    calculateTotal();

  return (
    <PageContainer pageTitle="장바구니">
      <CartSection title="상품 목록">
        {products.map((product) => (
          <ProductList
            product={product}
            addToCart={addToCart}
            getRemainingStock={getRemainingStock}
            getMaxDiscount={getMaxDiscount}
          />
        ))}
      </CartSection>
      <CartSection title="장바구니 내역">
        {cart.map((item) => (
          <ItemList
            item={item}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            getAppliedDiscount={getAppliedDiscount}
          />
        ))}
        <DetailInfoCard cardTitle="쿠폰 적용">
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
        </DetailInfoCard>
        <DetailInfoCard cardTitle="주문 요약">
          <div className="space-y-1">
            <p>상품 금액: {totalBeforeDiscount.toLocaleString()}원</p>
            <p className="text-green-600">
              할인 금액: {totalDiscount.toLocaleString()}원
            </p>
            <p className="text-xl font-bold">
              최종 결제 금액: {totalAfterDiscount.toLocaleString()}원
            </p>
          </div>
        </DetailInfoCard>
      </CartSection>
    </PageContainer>
  );
};
