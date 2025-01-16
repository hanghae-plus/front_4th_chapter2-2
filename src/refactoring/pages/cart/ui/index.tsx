import { CartItem, Product } from '../../../../types';
import { useCart } from '../../../entities/cart/model/useCart';
import { TextButton } from '../../../shared/ui';
import { DiscountCondition } from '../../../entities/discount/ui/DiscountCondition';
import { ProductDisplay } from '../../../entities/product/ui/ProductDisplay';
import { formatPrice } from '../../../entities/product/lib';
import { useProductContext } from '../../../entities/product/model/useProductContext';
import { useCouponContext } from '../../../entities/coupon/model/useCouponContext';

export function CartPage() {
  const { products } = useProductContext();
  const { coupons } = useCouponContext();

  const {
    cart,
    addToCart,
    removeFromCart,
    applyCoupon,
    calculateTotal,
    updateQuantity,
    selectedCoupon,
  } = useCart();

  const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
    return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
  };

  const getRemainingStock = (product: Product) => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };

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
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
          <div className="space-y-2">
            {products.map((product) => {
              const remainingStock = getRemainingStock(product);
              return (
                <ProductDisplay key={product.id} product={product}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{product.name}</span>
                    <span className="text-gray-600">{formatPrice(product.price)}</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    <span
                      className={`font-medium ${remainingStock > 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      재고: {remainingStock}개
                    </span>
                    {product.discounts.length > 0 && (
                      <span className="ml-2 font-medium text-blue-600">
                        최대 {(getMaxDiscount(product.discounts) * 100).toFixed(0)}% 할인
                      </span>
                    )}
                  </div>
                  <DiscountCondition discounts={product.discounts} />
                  <TextButton
                    variant="add"
                    title={remainingStock > 0 ? '장바구니에 추가' : '품절'}
                    onClick={() => addToCart(product)}
                    isDisabled={remainingStock <= 0}
                    fullWidth
                  />
                </ProductDisplay>
              );
            })}
          </div>
        </div>
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

          <div className="mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">쿠폰 적용</h2>
            <select
              onChange={(e) => applyCoupon(coupons[parseInt(e.target.value, 10)])}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="">쿠폰 선택</option>
              {coupons.map((coupon, index) => (
                <option key={coupon.code} value={index}>
                  {coupon.name} -{' '}
                  {coupon.discountType === 'amount'
                    ? `${coupon.discountValue}원`
                    : `${coupon.discountValue}%`}
                </option>
              ))}
            </select>
            {selectedCoupon && (
              <p className="text-green-600">
                적용된 쿠폰: {selectedCoupon.name}(
                {selectedCoupon.discountType === 'amount'
                  ? `${selectedCoupon.discountValue}원`
                  : `${selectedCoupon.discountValue}%`}{' '}
                할인)
              </p>
            )}
          </div>

          <div className="mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">주문 요약</h2>
            <div className="space-y-1">
              <p>상품 금액: {totalBeforeDiscount.toLocaleString()}원</p>
              <p className="text-green-600">할인 금액: {totalDiscount.toLocaleString()}원</p>
              <p className="text-xl font-bold">
                최종 결제 금액: {totalAfterDiscount.toLocaleString()}원
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
