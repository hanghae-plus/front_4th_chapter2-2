import { SectionTitle } from '../../../shared/ui/typography';
import { useCouponContext } from '../../../entities/coupon/model';
import { Select } from '../../../shared/ui/inputs';
import { useCartTotalContext } from '../../../entities/cart/model';

export function CouponSelector() {
  const { coupons } = useCouponContext();
  const { selectedCoupon, applyCoupon } = useCartTotalContext();

  const options = [
    { value: '', text: '쿠폰 선택' },
    ...coupons.map((coupon, index) => ({
      value: index,
      text: `${coupon.name} - ${coupon.discountType === 'amount' ? coupon.discountValue + '원' : coupon.discountValue + '%'}`,
    })),
  ];

  return (
    <>
      <SectionTitle title={'쿠폰 적용'} />
      <Select
        onChange={(e) => applyCoupon(coupons[parseInt(e.target.value)])}
        options={options}
      />
      {selectedCoupon && (
        <p className="text-green-600">
          적용된 쿠폰: {selectedCoupon.name}(
          {selectedCoupon.discountType === 'amount'
            ? `${selectedCoupon.discountValue}원`
            : `${selectedCoupon.discountValue}%`}{' '}
          할인)
        </p>
      )}
    </>
  );
}
