import { useState } from 'react';
import { Coupon, Product } from '../../../types.ts';
import { Title } from '../templates/Title.tsx';
import { Button } from '../ui/Button.tsx';
import { Card } from '../ui/Card.tsx';
import { Input } from '../ui/Input.tsx';
import { Select } from '../ui/Select.tsx';

type PropsType = {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
};
export const CouponManageSection = (props: PropsType) => {
  const { coupons, onCouponAdd } = props;

  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
    });
  };

  return (
    <div>
      <Title level={2}>쿠폰 관리</Title>
      <Card>
        <div className="space-y-2 mb-4">
          <Input
            placeholder="쿠폰 이름"
            value={newCoupon.name}
            wrapperClassName="mb-0"
            onChange={e => setNewCoupon({ ...newCoupon, name: e.target.value })}
          />
          <Input
            type="text"
            placeholder="쿠폰 코드"
            value={newCoupon.code}
            wrapperClassName="mb-0"
            onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })}
          />
          <div className="flex gap-2">
            <Select
              value={newCoupon.discountType}
              onChange={e =>
                setNewCoupon({
                  ...newCoupon,
                  discountType: e.target.value as 'amount' | 'percentage',
                })
              }
            >
              <option value="amount">금액(원)</option>
              <option value="percentage">할인율(%)</option>
            </Select>
            <input
              type="number"
              placeholder="할인 값"
              value={newCoupon.discountValue}
              onChange={e =>
                setNewCoupon({
                  ...newCoupon,
                  discountValue: parseInt(e.target.value),
                })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <Button
            fullWidth
            variant="green"
            onClick={handleAddCoupon}
            className="p-2"
          >
            쿠폰 추가
          </Button>
        </div>
        <div>
          <Title level={4}>현재 쿠폰 목록</Title>
          <div className="space-y-2">
            {coupons.map((coupon, index) => (
              <div
                key={index}
                data-testid={`coupon-${index + 1}`}
                className="bg-gray-100 p-2 rounded"
              >
                {coupon.name} ({coupon.code}):
                {coupon.discountType === 'amount'
                  ? `${coupon.discountValue}원`
                  : `${coupon.discountValue}%`}{' '}
                할인
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
