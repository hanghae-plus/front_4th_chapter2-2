import { Coupon } from 'src/types';

interface Props {
  couponList: Coupon[];
}

export const CouponList = ({ couponList }: Props) => {
  return (
    <div className='space-y-2'>
      {couponList.map((coupon, index) => (
        <div key={index} className='bg-gray-100 p-2 rounded' data-testid={`coupon-${index + 1}`}>
          {coupon.name} ({coupon.code}):
          {coupon.discountType === 'amount'
            ? `${coupon.discountValue}원`
            : `${coupon.discountValue}%`}{' '}
          할인
        </div>
      ))}
    </div>
  );
};
