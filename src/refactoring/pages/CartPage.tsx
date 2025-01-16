import { Coupon, Product } from "../../types.ts";
import { useCart } from "../hooks";
import {
  CouponSelect,
  DetailInfoCard,
  ItemList,
  ProductList,
} from "../components/cart";
import { PageContainer, PageSection, Text } from "../components/shared";
import { calculateTotal } from "../utils/cartUtils.ts";

interface CartPageProps {
  products: Product[];
  coupons: Coupon[];
}
export const CartPage = ({ products, coupons }: CartPageProps) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    getRemainingStock,
    addToCart,
    selectedCoupon,
  } = useCart();

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
    calculateTotal(cart, selectedCoupon);

  return (
    <PageContainer pageTitle="장바구니">
      <PageSection title="상품 목록">
        {products.map((product) => (
          <ProductList
            product={product}
            addToCart={addToCart}
            getRemainingStock={getRemainingStock}
          />
        ))}
      </PageSection>
      <PageSection title="장바구니 내역">
        {cart.map((item) => (
          <ItemList
            item={item}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
          />
        ))}
        <DetailInfoCard cardTitle="쿠폰 적용">
          <CouponSelect coupons={coupons} onSelect={applyCoupon} />
          {selectedCoupon && (
            <Text
              type="green"
              title="적용된 쿠폰"
              value={`${selectedCoupon.name}(${
                selectedCoupon.discountType === "amount"
                  ? `${selectedCoupon.discountValue}원`
                  : `${selectedCoupon.discountValue}%`
              } 할인)`}
            />
          )}
        </DetailInfoCard>
        <DetailInfoCard cardTitle="주문 요약">
          <div className="space-y-1">
            <Text
              title="상품 금액"
              value={`${totalBeforeDiscount.toLocaleString()}원`}
            />
            <Text
              type="green"
              title="할인 금액"
              value={`${totalDiscount.toLocaleString()}원`}
            />
            <Text
              type="xlBold"
              title="최종 결제 금액"
              value={`${totalAfterDiscount.toLocaleString()}원`}
            />
          </div>
        </DetailInfoCard>
      </PageSection>
    </PageContainer>
  );
};
