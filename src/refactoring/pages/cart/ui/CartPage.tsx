import { Coupon, Product } from '../../../../types.ts';
import { useCart } from '../model/useCart.ts';
import { Layout } from '../../../widgets/layout/Layout.tsx';
import { ProductList } from '../../../widgets/product/ui/ProductList.tsx';
import { CartList } from '../../../widgets/cart/ui/CartList.tsx';

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

  const productListProps = {
    products,
    cart,
    addToCart,
  };

  const cartListProps = {
    cart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    coupons,
    selectedCoupon,
  };

  return (
    <Layout title={'장바구니'}>
      <ProductList {...productListProps} />
      <CartList {...cartListProps} />
    </Layout>
  );
};
