import { Coupon, Product } from '@/shared/types/';
import { useCartStore } from '@/entities/cart';
import { getAppliedDiscount } from '@/entities/cart';
import { CartItem, GridContainer, GridItem } from '@/widgets/CartItem';
import { Button } from '@/shared/ui';

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export function CartPage({ products, coupons }: Props) {
  const { cart, removeFromCart, updateQuantity, applyCoupon, calculateTotal, selectedCoupon } = useCartStore();

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal();

  return (
    <GridContainer title={'장바구니'}>
      {/* 그리드 범주 1 */}
      <GridItem title={'상품 목록'}>
        <div className="space-y-2">
          {products.map((product) => (
            <CartItem product={product} key={product.id} />
          ))}
        </div>
      </GridItem>
      {/* 그리드 범주 2 */}
      <GridItem title={'장바구니 내역'}>
        <div className="space-y-2">
          {cart.map((item) => {
            const appliedDiscount = getAppliedDiscount(item);
            return (
              <div key={item.product.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
                <div>
                  <span className="font-semibold">{item.product.name}</span>
                  <br />
                  <span className="text-sm text-gray-600">
                    {item.product.price}원 x {item.quantity}
                    {appliedDiscount > 0 && (
                      <span className="text-green-600 ml-1">({(appliedDiscount * 100).toFixed(0)}% 할인 적용)</span>
                    )}
                  </span>
                </div>
                <div>
                  <Button variant="primary" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                    -
                  </Button>
                  <Button variant="primary" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                    +
                  </Button>
                  <Button variant="danger" onClick={() => removeFromCart(item.product.id)}>
                    삭제
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-2xl font-semibold mb-2">쿠폰 적용</h2>
          <select
            onChange={(e) => applyCoupon(coupons[parseInt(e.target.value)])}
            className="w-full p-2 border rounded mb-2"
          >
            <option value="">쿠폰 선택</option>
            {coupons.map((coupon, index) => (
              <option key={coupon.code} value={index}>
                {coupon.name} -{' '}
                {coupon.discountType === 'amount' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`}
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
            <p className="text-xl font-bold">최종 결제 금액: {totalAfterDiscount.toLocaleString()}원</p>
          </div>
        </div>
      </GridItem>
    </GridContainer>
  );
}
