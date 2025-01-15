import { Coupon, Product } from '../../types';
import { useCart } from '../hooks';
import { ProductList } from './ProductList';
import { CartList } from './CartList';
import { CouponSelector } from './CouponSeletor';
import { OrderSummary } from './OrderSummary';

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

  const getRemainingStock = (product: Product) => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal();

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>장바구니</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <ProductList
          productList={productList}
          addToCart={addToCart}
          getRemainingStock={getRemainingStock}
        />
        <CartList cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
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
