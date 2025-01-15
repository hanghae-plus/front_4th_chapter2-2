import { InputField } from './InputField';
import { CouponType } from '../types';

interface CouponFormProps {
  newCoupon: CouponType;
  setNewCoupon: React.Dispatch<React.SetStateAction<CouponType>>;
  onAddCoupon: () => void;
}

export const CouponForm: React.FC<CouponFormProps> = ({ newCoupon, setNewCoupon, onAddCoupon }) => (
  <div className='space-y-2 mb-4'>
    <InputField
      id='coupon-name'
      placeholder='쿠폰 이름'
      value={newCoupon.name}
      type='text'
      onChange={(e) => setNewCoupon({ ...newCoupon, name: e.target.value })}
    />
    <InputField
      id='coupon-code'
      placeholder='쿠폰 코드'
      value={newCoupon.code}
      type='text'
      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
    />
    <div className='flex gap-2'>
      <select
        value={newCoupon.discountType}
        onChange={(e) =>
          setNewCoupon({ ...newCoupon, discountType: e.target.value as 'amount' | 'percentage' })
        }
        className='w-full p-2 border rounded'
      >
        <option value='amount'>금액(원)</option>
        <option value='percentage'>할인율(%)</option>
      </select>
      <InputField
        id='coupon-discount-value'
        placeholder='할인 값'
        value={newCoupon.discountValue}
        type='number'
        className='w-full p-2 border rounded'
        onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: parseInt(e.target.value) })}
      />
    </div>
    <button
      onClick={onAddCoupon}
      className='w-full bg-green-500 text-white p-2 rounded hover:bg-green-600'
    >
      쿠폰 추가
    </button>
  </div>
);
