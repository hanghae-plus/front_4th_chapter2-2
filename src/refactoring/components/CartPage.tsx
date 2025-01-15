import { useEffect, useState, useCallback, useMemo } from "react";
import { useCart } from "../hooks/useCart.ts";
import { useProducts } from "../hooks/useProducts.ts";
import { Coupon, Product, CartTotal } from "../../types.ts";
import { ProductList } from "./cartpage/CartProductList.tsx";
import { CartDetail } from "./cartpage/CartDetail.tsx";
import { CouponSection } from "./cartpage/CartCouponSection.tsx";
import { OrderSummary } from "./cartpage/CartOrderSummary.tsx";

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products = [], coupons = [] }: Props) => {

  const { 
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    getRemainingStock,
    getAppliedDiscount,
  } = useCart();

  const { getMaxDiscount } = useProducts(products);

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [summary, setSummary] = useState<CartTotal>({
    totalBeforeDiscount: 0,
    totalAfterDiscount: 0,
    totalDiscount: 0,
  });

  // 쿠폰 적용 및 상태 업데이트
  const handleApplyCoupon = useCallback((index: number) => {
    const selected = coupons[index];
    if (index === -1) {  // "쿠폰 선택"을 선택한 경우
      applyCoupon(null);  // 쿠폰을 취소
      setSelectedCoupon(null); // 상태 초기화
    } else {
      applyCoupon(selected);  // 새로운 쿠폰 적용
      setSelectedCoupon(selected); // 상태 업데이트
    }
  }, [coupons, applyCoupon]);

  // 상품별 최대 할인율 계산 메모이제이션
  const memoizedMaxDiscount = useMemo(() => {
    return products.reduce<Record<string, number>>((acc, product) => ({
      ...acc,
      [product.id]: getMaxDiscount(product.discounts)
    }), {});
  }, [products, getMaxDiscount]);

  // selectedCoupon이 변경될 때마다 계산
  useEffect(() => {
    const cartTotal = calculateTotal();
    setSummary(cartTotal);
  }, [selectedCoupon, cart]); // selectedCoupon 또는 cart 변경 시 재계산

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductList 
          products={products}
          addToCart={addToCart}
          getRemainingStock={getRemainingStock}
          getMaxDiscount={memoizedMaxDiscount}
        />
        <div>
          <CartDetail 
            cart={cart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            getAppliedDiscount={getAppliedDiscount}
          />
          <CouponSection 
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            handleApplyCoupon={handleApplyCoupon}
          />
          <OrderSummary 
            summary={summary}
          />
        </div>
      </div>
    </div>
  );
};
