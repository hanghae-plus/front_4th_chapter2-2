import { Product, Coupon } from '../../types';
import { CartItem } from '../features/cart/components/Item';
import { CouponSelector } from '../features/coupon/components/Selector';
import { useCart } from '../features/cart/hooks/useCart';
import { ProductItem } from '../features/product/components/Item';
import { ProductSortType, useProductSort } from '../features/product/hooks/useProductSort';
import { calculateAppliedDiscount, getRemainingStock } from '../features/cart/helpers';

interface CartPageProps {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: CartPageProps) => {
  const { cart, addToCart, removeFromCart, updateQuantity, applyCoupon, calculateTotal, selectedCoupon } = useCart();

  const { sortType, setSortType, sortOptions, sortedProducts } = useProductSort({
    products,
    getRemaining: (product) => getRemainingStock(product, cart),
  });

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value as ProductSortType)}
            className="p-2 border rounded mb-4"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="space-y-2">
            {sortedProducts.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                remainingStock={getRemainingStock(product, cart)}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>

          <div className="space-y-2">
            {cart.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                appliedDiscount={calculateAppliedDiscount(item, item.product.discounts)}
                onUpdateQuantity={updateQuantity}
                onRemoveFromCart={removeFromCart}
              />
            ))}
          </div>

          <CouponSelector coupons={coupons} selectedCoupon={selectedCoupon} onApplyCoupon={applyCoupon} />

          <div className="mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">주문 요약</h2>
            <div className="space-y-1">
              <p>상품 금액: {totalBeforeDiscount.toLocaleString()}원</p>
              <p className="text-green-600">할인 금액: {totalDiscount.toLocaleString()}원</p>
              <p className="text-xl font-bold">최종 결제 금액: {totalAfterDiscount.toLocaleString()}원</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
