import { CartInfo } from './components/CartInfo';
import { CartItemActions } from './components/CartItemActions';
import { CartItemCard } from './components/CartItemCard';
import CouponSelector from './components/CouponSelector';
import { OrderSummary } from './components/OrderSummary';
import ProductItem from './components/ProductItem';
import { useCart } from './hooks/useCart';

import type { Coupon, Product } from '../../../types';

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  const { cart, addToCart, removeFromCart, updateQuantity, applyCoupon, calculateTotal, selectedCoupon } = useCart();

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
          <div className="space-y-2">
            {products.map((product) => (
              <ProductItem product={product} cart={cart} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>
          <div className="space-y-2">
            {cart.map((item) => {
              return (
                <CartItemCard key={item.product.id}>
                  <CartInfo item={item} />
                  <CartItemActions item={item} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
                </CartItemCard>
              );
            })}
          </div>

          <CouponSelector coupons={coupons} selectedCoupon={selectedCoupon} onApplyCoupon={applyCoupon} />

          <OrderSummary
            totalBeforeDiscount={totalBeforeDiscount}
            totalDiscount={totalDiscount}
            totalAfterDiscount={totalAfterDiscount}
          />
        </div>
      </div>
    </div>
  );
};
