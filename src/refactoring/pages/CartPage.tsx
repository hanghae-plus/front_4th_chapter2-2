import { Coupon, Product } from '../../types.ts';
import { useCart } from '../hooks/useCart';
import { ProductList } from '../components/cart/ProductList';
import { CartList } from '../components/cart/CartList';
import { CouponSection } from '../components/cart/CouponSection';
import { OrderSummary } from '../components/cart/OrderSummary';
import { getMaxDiscount, getRemainingStock } from '../utils/cartUtils.ts';

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

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>장바구니</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <ProductList
            products={products}
            cart={cart}
            addToCart={addToCart}
            getRemainingStock={getRemainingStock}
            getMaxDiscount={getMaxDiscount}
          />
        </div>
        <div>
          <h2 className='text-2xl font-semibold mb-4'>장바구니 내역</h2>
          <CartList cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />

          <CouponSection
            coupons={coupons}
            applyCoupon={applyCoupon}
            selectedCoupon={selectedCoupon}
          />

          <OrderSummary
            totalBeforeDiscount={calculateTotal().totalBeforeDiscount}
            totalDiscount={calculateTotal().totalDiscount}
            totalAfterDiscount={calculateTotal().totalAfterDiscount}
          />
        </div>
      </div>
    </div>
  );
};
