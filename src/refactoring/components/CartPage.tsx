import { Coupon, Product } from '../../types';
import { useCart } from '../hooks';
import { CartList } from './cart/CartList';
import { ProductList } from './product/ProductList';
import { Heading } from './shared/Heading';

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export function CartPage({ products, coupons }: Props) {
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
    <div className="container mx-auto p-4">
      <Heading as="h1" className="text-3xl font-bold mb-6">
        장바구니
      </Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductList cart={cart} products={products} addToCart={addToCart} />
        <CartList
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          calculateTotal={calculateTotal}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          applyCoupon={applyCoupon}
        />
      </div>
    </div>
  );
}
