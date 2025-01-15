import { CouponType } from '../../types';

interface Props {
  couponList: CouponType[];
  applyCoupon: (coupon: CouponType) => void;
  selectedCoupon: CouponType | null;
}

export const CouponSelector = ({ couponList, applyCoupon, selectedCoupon }: Props) => (
  <div className='bg-white p-3 rounded shadow mt-6'>
    <h3 className='font-semibold mb-4'>쿠폰 적용</h3>
    <select
      onChange={(e) => applyCoupon(couponList[parseInt(e.target.value)])}
      value={selectedCoupon ? couponList.indexOf(selectedCoupon) : ''}
      className='w-full p-2 border rounded'
    >
      <option value=''>쿠폰 선택</option>
      {couponList.map((coupon, index) => (
        <option key={coupon.code} value={index}>
          {coupon.name} -{' '}
          {coupon.discountType === 'amount'
            ? `${coupon.discountValue}원`
            : `${coupon.discountValue}%`}
        </option>
      ))}
    </select>
  </div>
);
