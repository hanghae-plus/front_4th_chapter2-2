import { useCart } from '../../hooks/index.ts';
import CartSummaryWidget from '../../widgets/user/CartSummaryWidget.tsx';
import ProductListWidget from '../../widgets/user/ProductListWidget.tsx';

export const CartPage = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, calculateTotal } = useCart();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 상품 목록 위젯 */}
        <ProductListWidget cart={cart} onAddToCart={addToCart} />

        {/* 장바구니 요약 위젯 */}
        <CartSummaryWidget
          cart={cart}
          calculateTotal={calculateTotal}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
        />
      </div>
    </div>
  );
};
