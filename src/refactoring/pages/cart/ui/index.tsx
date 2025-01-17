import { CartItem } from '../../../../types';
import { useCart } from '../../../entities/cart/model/useCart';
import { TextButton } from '../../../shared/ui';
import ProductList from '../../../features/product/ui/ProductList';
import { CouponApplyBox } from '../../../features/coupon/ui/CouponApplyBox';
import { CartSummary } from '../../../entities/cart/ui/CartSummary.tsx';

export function CartPage() {
  const {
    cart,
    addToCart,
    removeFromCart,
    applyCoupon,
    calculateTotal,
    updateQuantity,
    selectedCoupon,
  } = useCart();

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal();

  const getAppliedDiscount = (item: CartItem) => {
    const { discounts } = item.product;
    const { quantity } = item;

    return discounts
      .filter((discount) => discount.quantity < quantity)
      .reduce((sum, discount) => Math.max(sum, discount.rate), 0);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductList cart={cart} addToCart={addToCart} />
        <div>
          <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>
          <div className="space-y-2">
            {cart.map((item) => {
              const appliedDiscount = getAppliedDiscount(item);
              return (
                <div
                  key={item.product.id}
                  className="flex justify-between items-center bg-white p-3 rounded shadow"
                >
                  <div>
                    <span className="font-semibold">{item.product.name}</span>
                    <br />
                    <span className="text-sm text-gray-600">
                      {item.product.price}원 x {item.quantity}
                      {appliedDiscount > 0 && (
                        <span className="text-green-600 ml-1">
                          ({(appliedDiscount * 100).toFixed(0)}% 할인 적용)
                        </span>
                      )}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
                    >
                      -
                    </button>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
                    >
                      +
                    </button>
                    <TextButton
                      variant="danger"
                      title="삭제"
                      onClick={() => removeFromCart(item.product.id)}
                      className="px-2 py-1"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <CouponApplyBox selectedCoupon={selectedCoupon} applyCoupon={applyCoupon} />
          <CartSummary
            totalBeforeDiscount={totalBeforeDiscount}
            totalDiscount={totalDiscount}
            totalAfterDiscount={totalAfterDiscount}
          />
        </div>
      </div>
    </div>
  );
}
