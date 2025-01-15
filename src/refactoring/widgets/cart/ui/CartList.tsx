import { SectionTitle } from '../../../shared/ui/typography';
import { CartItem } from '../../../features/cart/ui/CartItem.tsx';
import { ICartItem, ICoupon } from '../../../app/types';

interface CartListProps {
  cart: ICartItem[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  applyCoupon: (coupon: ICoupon) => void;
  calculateTotal: () => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
    totalDiscount: number;
  };
  coupons: ICoupon[];
  selectedCoupon: ICoupon | null;
}

export function CartList({
  cart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  calculateTotal,
  coupons,
  selectedCoupon,
}: CartListProps) {
  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
    calculateTotal();

  return (
    <div>
      <SectionTitle title={'장바구니 내역'} />

      <div className="space-y-2">
        {cart.map((item) => (
          <CartItem
            key={item.product.id}
            item={item}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
          />
        ))}
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow">
        <SectionTitle title={'쿠폰 적용'} />
        <select
          onChange={(e) => applyCoupon(coupons[parseInt(e.target.value)])}
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
        <SectionTitle title={'주문 요약'} />
        <div className="space-y-1">
          <p>상품 금액: {totalBeforeDiscount.toLocaleString()}원</p>
          <p className="text-green-600">
            할인 금액: {totalDiscount.toLocaleString()}원
          </p>
          <p className="text-xl font-bold">
            최종 결제 금액: {totalAfterDiscount.toLocaleString()}원
          </p>
        </div>
      </div>
    </div>
  );
}
