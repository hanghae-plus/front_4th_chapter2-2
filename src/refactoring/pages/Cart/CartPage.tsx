import { useCart } from '@/refactoring/pages/Cart/hooks/useCart';
import { ProductList } from '@/refactoring/pages/Cart/ProductList';
import { ShoppingCart } from '@/refactoring/pages/Cart/ShoppingCart';
import type { Coupon, Product } from '@/types';

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  const { cart, addToCart, removeFromCart, updateQuantity, applyCoupon, calculateTotal, selectedCoupon } = useCart();

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">장바구니</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ProductList products={products} cart={cart} onCartAdd={addToCart} />

        <ShoppingCart
          cart={cart}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          calculateTotal={calculateTotal}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          applyCoupon={applyCoupon}
        />
      </div>
    </div>
  );
};
