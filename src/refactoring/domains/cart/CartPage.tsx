import { CartInfo, CartItemActions, CartItemCard, CouponSelector, OrderSummary, ProductItem } from './components';
import { ProductSearchField } from './components/product/ProductSearchField';
import { useCart } from './hooks/useCart';
import { useSearchProduct } from './hooks/useSearchProduct';
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

  const { handleSearch, filteredProducts } = useSearchProduct(products);

  return (
    <PageContainer title="장바구니">
      <Section title="상품 목록">
        <div className="space-y-2">
          <ProductSearchField onSearch={handleSearch} />
          {filteredProducts.map((product) => (
            <ProductItem key={product.id} product={product} cart={cart} onAddToCart={addToCart} />
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
        {/* 쿠폰 적용 */}
        <CouponSelector coupons={coupons} selectedCoupon={selectedCoupon} onApplyCoupon={applyCoupon} />
        {/* 주문요약 */}
        <OrderSummary
          totalBeforeDiscount={totalBeforeDiscount}
          totalDiscount={totalDiscount}
          totalAfterDiscount={totalAfterDiscount}
        />
      </Section>
    </PageContainer>
  );
};
