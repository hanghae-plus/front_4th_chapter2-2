import { CartInfo } from './components/CartInfo';
import { CartItemActions } from './components/CartItemActions';
import { CartItemCard } from './components/CartItemCard';
import CouponSelector from './components/CouponSelector';
import { OrderSummary } from './components/OrderSummary';
import ProductItem from './components/ProductItem';
import { useCart } from './hooks/useCart';
import { PageContainer } from '../../shared/page-container/PageContainer';
import { Section } from '../../shared/section/Section';

import type { Coupon, Product } from '../../../types';

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  const { cart, addToCart, removeFromCart, updateQuantity, applyCoupon, calculateTotal, selectedCoupon } = useCart();

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal();

  return (
    <PageContainer title="장바구니">
      <Section title="상품 목록">
        <div className="space-y-2">
          {products.map((product) => (
            <ProductItem product={product} cart={cart} onAddToCart={addToCart} />
          ))}
        </div>
      </Section>

      <Section title="장바구니 내역">
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
      </Section>
    </PageContainer>
  );
};
