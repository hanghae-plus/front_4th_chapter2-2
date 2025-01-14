import { Coupon, Product } from '../../types';
import CartList from '../components/CartList';
import CouponForm from '../components/CouponForm';
import OrderSummary from '../components/OrderSummary';
import ProductList from '../components/ProductList';
import { useCart } from '../hooks';

interface Props {
  productList: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ productList, coupons }: Props) => {
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
          <CouponForm coupons={coupons} applyCoupon={applyCoupon} selectedCoupon={selectedCoupon} />
          <OrderSummary calculateTotal={calculateTotal} />
        </div>
      </div>
    </div>
  );
};
