import { Coupon, Product } from '../../types';
import { useCart } from '../hooks';
import { ProductList } from '../components/Cart/ProductList';
import { CartList } from '../components/Cart/CartList';
import { CouponSelector } from '../components/Cart/CouponSeletor';
import { OrderSummary } from '../components/Cart/OrderSummary';

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
  } = useCart();

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>장바구니</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <ProductList productList={productList} cart={cart} addToCart={addToCart} />
        <div>
          <CartList cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
          <CouponSelector
            couponList={couponList}
            selectedCoupon={selectedCoupon}
            applyCoupon={applyCoupon}
          />
          <OrderSummary calculateTotal={calculateTotal} />
        </div>
      </div>
    </div>
  );
};
