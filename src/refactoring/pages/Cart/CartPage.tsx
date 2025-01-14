import { CartItem } from '@/refactoring/pages/Cart/components/CartItem';
import { useCart } from '@/refactoring/pages/Cart/hooks/useCart';
import type { CartItem as CartItemType, Coupon, Product } from '@/types';

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  const { cart, addToCart, removeFromCart, updateQuantity, applyCoupon, calculateTotal, selectedCoupon } = useCart();

  const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
    return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
  };

  const getRemainingStock = (product: Product, cart: CartItemType[]) => {
    const cartItem = cart.find(item => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal();

  const handleAddToCart = (product: Product) => {
    const remainingStock = getRemainingStock(product, cart);
    if (remainingStock <= 0) return;

    addToCart(product);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">장바구니</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">상품 목록</h2>
          <div className="space-y-2">
            {products.map(product => {
              const remainingStock = getRemainingStock(product, cart);
              return (
                <div key={product.id} data-testid={`product-${product.id}`} className="rounded bg-white p-3 shadow">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold">{product.name}</span>
                    <span className="text-gray-600">{product.price.toLocaleString()}원</span>
                  </div>
                  <div className="mb-2 text-sm text-gray-500">
                    <span className={`font-medium ${remainingStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      재고: {remainingStock}개
                    </span>
                    {product.discounts.length > 0 && (
                      <span className="ml-2 font-medium text-blue-600">
                        최대 {(getMaxDiscount(product.discounts) * 100).toFixed(0)}% 할인
                      </span>
                    )}
                  </div>
                  {product.discounts.length > 0 && (
                    <ul className="mb-2 list-inside list-disc text-sm text-gray-500">
                      {product.discounts.map((discount, index) => (
                        <li key={index}>
                          {discount.quantity}개 이상: {(discount.rate * 100).toFixed(0)}% 할인
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`w-full rounded px-3 py-1 ${
                      remainingStock > 0
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'cursor-not-allowed bg-gray-300 text-gray-500'
                    }`}
                    disabled={remainingStock <= 0}
                  >
                    {remainingStock > 0 ? '장바구니에 추가' : '품절'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-semibold">장바구니 내역</h2>

          <div className="space-y-2">
            {cart.map(item => {
              return (
                <CartItem
                  key={item.product.id}
                  cart={item}
                  onQuantityUpdate={updateQuantity}
                  onCartRemove={removeFromCart}
                />
              );
            })}
          </div>

          <div className="mt-6 rounded bg-white p-4 shadow">
            <h2 className="mb-2 text-2xl font-semibold">쿠폰 적용</h2>

            <CouponSelect coupons={coupons} onCouponApply={applyCoupon} />
            {selectedCoupon && <AppliedCoupon appliedCoupon={selectedCoupon} />}
          </div>

          <div className="mt-6 rounded bg-white p-4 shadow">
            <h2 className="mb-2 text-2xl font-semibold">주문 요약</h2>
            <div className="space-y-1">
              <p>상품 금액: {totalBeforeDiscount.toLocaleString()}원</p>
              <p className="text-green-600">할인 금액: {totalDiscount.toLocaleString()}원</p>
              <p className="text-xl font-bold">최종 결제 금액: {totalAfterDiscount.toLocaleString()}원</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
