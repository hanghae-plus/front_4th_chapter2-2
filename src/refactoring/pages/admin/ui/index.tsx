import { useState } from 'react';
import { Coupon } from '../../../../types';
import { TextButton } from '../../../shared/ui';
import { useCouponContext } from '../../../entities/coupon/model/useCouponContext';
import { ProductManagement } from '../../../widgets/product/ProductManagement';

export function AdminPage() {
  const { coupons, addCoupon } = useCouponContext();
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });

  const handleAddCoupon = () => {
    addCoupon(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductManagement />
        <div>
          <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
          <div className="bg-white p-4 rounded shadow">
            <div className="space-y-2 mb-4">
              <input
                type="text"
                placeholder="쿠폰 이름"
                value={newCoupon.name}
                onChange={(e) => setNewCoupon({ ...newCoupon, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="쿠폰 코드"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <div className="flex gap-2">
                <select
                  value={newCoupon.discountType}
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      discountType: e.target.value as 'amount' | 'percentage',
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="amount">금액(원)</option>
                  <option value="percentage">할인율(%)</option>
                </select>
                <input
                  type="number"
                  placeholder="할인 값"
                  value={newCoupon.discountValue}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, discountValue: parseInt(e.target.value, 10) })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <TextButton
                variant="complete"
                title="쿠폰 추가"
                onClick={handleAddCoupon}
                fullWidth
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
              <div className="space-y-2">
                {coupons.map((coupon, index) => {
                  const key = `${index}-${coupon.name}`;
                  return (
                    <div
                      key={key}
                      data-testid={`coupon-${index + 1}`}
                      className="bg-gray-100 p-2 rounded"
                    >
                      {coupon.name} ({coupon.code}):
                      {coupon.discountType === 'amount'
                        ? `${coupon.discountValue}원`
                        : `${coupon.discountValue}%`}{' '}
                      할인
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
