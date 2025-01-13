import { CartItem, Coupon, Product } from "../../types.ts";
import { useCart } from "../hooks/index.ts";
import Container from "../components/layout/Container.tsx";
import ContentSection from "../components/layout/ContentSection.tsx";
import ProductCard from "../components/product/ProductCard.tsx";
import CartProductCard from "../components/cart/CartProductCard.tsx";
import OrderSummary from "../components/cart/OrderSummary.tsx";

interface Props {
  products: Array<Product>;
  coupons: Array<Coupon>;
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

  const getRemainingStock = (product: Product) => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };

  const getMaxDiscount = (
    discounts: Array<{ quantity: number; rate: number }>
  ) => {
    return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
  };

  return (
    <Container title="장바구니">
      <ContentSection subTitle="상품 목록">
        <div className="space-y-2">
          {products.map((product) => {
            const remainingStock = getRemainingStock(product);
            const maxDiscount = getMaxDiscount(product.discounts);

            return (
              <ProductCard
                product={product}
                remainingStock={remainingStock}
                maxDiscount={maxDiscount}
                addToCart={addToCart}
              />
            );
          })}
        </div>
      </ContentSection>

      <ContentSection subTitle="장바구니 내역">
        <div className="space-y-2">
          {cart.map((item) => {
            const appliedDiscount = getAppliedDiscount(item);
            return (
              <CartProductCard
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

        <OrderSummary calculateTotal={calculateTotal} />
      </ContentSection>
    </Container>
  );
};
