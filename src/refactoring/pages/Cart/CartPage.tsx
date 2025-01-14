import { useCart } from '@/refactoring/hooks/useCart';
import { AppliedCoupon } from '@/refactoring/pages/Cart/components/AppliedCoupon';
import { CartItem } from '@/refactoring/pages/Cart/components/CartItem';
import { CouponSelect } from '@/refactoring/pages/Cart/components/CouponSelect';
import { OrderSummary } from '@/refactoring/pages/Cart/components/OrderSummary';
import { ProductItem } from '@/refactoring/pages/Cart/components/ProductItem';
import type { Coupon, Product } from '@/types';

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  const { cart, addToCart, removeFromCart, updateQuantity, applyCoupon, calculateTotal, selectedCoupon } = useCart();

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal();

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">장바구니</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">상품 목록</h2>
          <div className="space-y-2">
            {products.map(product => {
              return <ProductItem key={product.id} product={product} cart={cart} onCartAdd={addToCart} />;
            })}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-semibold">장바구니 내역</h2>
          <div className="space-y-2">
            {cart.map(item => {
              return (
                <CartItem
                  key={item.product.id}
                  cart={item}
                  onQuantityUpdate={updateQuantity}
                  onCartRemove={removeFromCart}
                />
              );
            })}
          </div>

          <div className="mt-6 rounded bg-white p-4 shadow">
            <h2 className="mb-2 text-2xl font-semibold">쿠폰 적용</h2>
            <CouponSelect coupons={coupons} onCouponApply={applyCoupon} />
            {selectedCoupon && <AppliedCoupon appliedCoupon={selectedCoupon} />}
          </div>

          <div className="mt-6 rounded bg-white p-4 shadow">
            <h2 className="mb-2 text-2xl font-semibold">주문 요약</h2>
            <OrderSummary
              totalBeforeDiscount={totalBeforeDiscount}
              totalAfterDiscount={totalAfterDiscount}
              totalDiscount={totalDiscount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
