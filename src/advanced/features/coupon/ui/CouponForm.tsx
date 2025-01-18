import { Input, Select } from '@advanced/shared/ui';
import { useCoupon } from '../model';

const discountTypeOptions = [
  { value: 'amount', label: '금액(원)' },
  { value: 'percentage', label: '할인율(%)' },
];

export function CouponForm() {
  const { newCoupon, changeCoupon, addCoupon } = useCoupon();

  return (
    <form
      className="space-y-2 mb-4"
      onSubmit={(e) => {
        e.preventDefault();
        addCoupon(newCoupon);
      }}
    >
      <Input
        type="text"
        placeholder="쿠폰 이름"
        value={newCoupon.name}
        onChange={(e) => changeCoupon({ name: e.target.value })}
      />
      <Input
        type="text"
        placeholder="쿠폰 코드"
        value={newCoupon.code}
        onChange={(e) => changeCoupon({ code: e.target.value })}
      />
      <div className="flex gap-2">
        <Select
          options={discountTypeOptions}
          onChange={(e) =>
            changeCoupon({
              discountType: e.target.value as 'amount' | 'percentage',
            })
          }
        />
        <Input
          type="number"
          placeholder="할인 값"
          value={newCoupon.discountValue}
          onChange={(e) => {
            changeCoupon({
              discountValue: parseInt(e.target.value),
            });
          }}
        />
      </div>
      <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
        쿠폰 추가
      </button>
    </form>
  );
}
