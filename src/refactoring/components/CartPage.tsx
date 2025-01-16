import { CartItem, Coupon, Product } from "../../types.ts";
import { useCart } from "../hooks/index.ts";
import PageSection from "./PageSection.tsx";
import Button from "./common/Button.tsx";
import PageContainer from "./common/PageContainer.tsx";

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

  const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
    return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
  };

  const getRemainingStock = (product: Product) => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
    calculateTotal();

  const getAppliedDiscount = (item: CartItem) => {
    const { discounts } = item.product;
    const { quantity } = item;
    let appliedDiscount = 0;
    for (const discount of discounts) {
      if (quantity >= discount.quantity) {
        appliedDiscount = Math.max(appliedDiscount, discount.rate);
      }
    }
    return appliedDiscount;
  };

  return (
    <PageContainer title="장바구니 페이지">
      {/* --상품목록 */}
      <PageSection title="상품 목록">
        {products.map((product) => {
          const remainingStock = getRemainingStock(product);
          return (
            <div
              key={product.id}
              data-testid={`product-${product.id}`}
              className="bg-white p-3 rounded shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{product.name}</span>
                <span className="text-gray-600">
                  {product.price.toLocaleString()}원
                </span>
              </div>
              <div className="text-sm text-gray-500 mb-2">
                <span
                  className={`font-medium ${
                    remainingStock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  재고: {remainingStock}개
                </span>
                {product.discounts.length > 0 && (
                  <span className="ml-2 font-medium text-blue-600">
                    최대 {(getMaxDiscount(product.discounts) * 100).toFixed(0)}%
                    할인
                  </span>
                )}
              </div>
              {product.discounts.length > 0 && (
                <ul className="list-disc list-inside text-sm text-gray-500 mb-2">
                  {product.discounts.map((discount, index) => (
                    <li key={index}>
                      {discount.quantity}개 이상:{" "}
                      {(discount.rate * 100).toFixed(0)}% 할인
                    </li>
                  ))}
                </ul>
              )}
              <Button
                onClick={() => addToCart(product)}
                variant={remainingStock > 0 ? "fullBlueBtn" : "fullGrayBtn"}
                disabled={remainingStock <= 0}
              >
                {remainingStock > 0 ? "장바구니에 추가" : "품절"}
              </Button>
            </div>
          );
        })}
      </PageSection>
      {/* 상품목록-- */}

      {/* --장바구니 내역 */}
      <PageSection title="장바구니 내역">
        {cart.map((item) => {
          const appliedDiscount = getAppliedDiscount(item);
          return (
            <div
              key={item.product.id}
              className="flex justify-between items-center bg-white p-3 rounded shadow"
            >
              <div>
                <span className="font-semibold">{item.product.name}</span>
                <br />
                <span className="text-sm text-gray-600">
                  {item.product.price}원 x {item.quantity}
                  {appliedDiscount > 0 && (
                    <span className="text-green-600 ml-1">
                      ({(appliedDiscount * 100).toFixed(0)}% 할인 적용)
                    </span>
                  )}
                </span>
              </div>
              <div>
                <Button
                  onClick={() =>
                    updateQuantity(item.product.id, item.quantity - 1)
                  }
                  variant="smallGrayBtn"
                >
                  -
                </Button>
                <Button
                  onClick={() =>
                    updateQuantity(item.product.id, item.quantity + 1)
                  }
                  variant="smallGrayBtn"
                >
                  +
                </Button>
                <Button
                  onClick={() => removeFromCart(item.product.id)}
                  variant="smallRedBtn"
                >
                  삭제
                </Button>
              </div>
            </div>
          );
        })}

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

        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-2xl font-semibold mb-2">주문 요약</h2>
          <div className="space-y-1">
            <p>상품 금액: {totalBeforeDiscount.toLocaleString()}원</p>
            <p className="text-green-600">
              할인 금액: {totalDiscount.toLocaleString()}원
            </p>
            <p className="text-xl font-bold">
              최종 결제 금액: {totalAfterDiscount.toLocaleString()}원
            </p>
          </div>
        </div>
      </PageSection>

      {/* 장바구니 내역-- */}
    </PageContainer>
  );
};
