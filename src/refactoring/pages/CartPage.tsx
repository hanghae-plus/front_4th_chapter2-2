import { Coupon, Product } from '../../types';
import { useCart } from '../hooks';
import { ProductList } from '../components/ProductList';
import { CartList } from '../components/CartList';
import { CouponSelector } from '../components/CouponSeletor';
import { OrderSummary } from '../components/OrderSummary';

interface Props {
  productList: Product[];
  couponList: Coupon[];
}

export const CartPage = ({ productList, couponList }: Props) => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
    getRemainingStock,
    getMaxDiscount,
    getAppliedDiscount,
  } = useCart();

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal();

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>장바구니</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <ProductList
          productList={productList}
          addToCart={addToCart}
          getRemainingStock={getRemainingStock}
          getMaxDiscount={getMaxDiscount}
        />
        <CartList
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          getAppliedDiscount={getAppliedDiscount}
        />
        <CouponSelector
          couponList={couponList}
          selectedCoupon={selectedCoupon}
          applyCoupon={applyCoupon}
        />
        <OrderSummary
          totalBeforeDiscount={totalBeforeDiscount}
          totalAfterDiscount={totalAfterDiscount}
          totalDiscount={totalDiscount}
        />
      </div>
    </div>
  );
};
