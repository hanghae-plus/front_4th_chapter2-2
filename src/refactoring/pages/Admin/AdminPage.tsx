import { useState } from 'react';

import { ProductManagement } from '@/refactoring/pages/Admin/ProductManagement/ProductManagement';
import type { Coupon, Product } from '@/types';

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const AdminPage = ({ products, coupons, onProductUpdate, onProductAdd, onCouponAdd }: Props) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0
  });

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">관리자 페이지</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ProductManagement products={products} onProductAdd={onProductAdd} onProductUpdate={onProductUpdate} />

        <div>
          <h2 className="mb-4 text-2xl font-semibold">쿠폰 관리</h2>
          <div className="rounded bg-white p-4 shadow">
            <div className="mb-4 space-y-2">
              <input
                type="text"
                placeholder="쿠폰 이름"
                value={newCoupon.name}
                onChange={e => setNewCoupon({ ...newCoupon, name: e.target.value })}
                className="w-full rounded border p-2"
              />
              <input
                type="text"
                placeholder="쿠폰 코드"
                value={newCoupon.code}
                onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })}
                className="w-full rounded border p-2"
              />
              <div className="flex gap-2">
                <select
                  value={newCoupon.discountType}
                  onChange={e =>
                    setNewCoupon({ ...newCoupon, discountType: e.target.value as 'amount' | 'percentage' })
                  }
                  className="w-full rounded border p-2"
                >
                  <option value="amount">금액(원)</option>
                  <option value="percentage">할인율(%)</option>
                </select>
                <input
                  type="number"
                  placeholder="할인 값"
                  value={newCoupon.discountValue}
                  onChange={e => setNewCoupon({ ...newCoupon, discountValue: parseInt(e.target.value) })}
                  className="w-full rounded border p-2"
                />
              </div>
              <button
                onClick={handleAddCoupon}
                className="w-full rounded bg-green-500 p-2 text-white hover:bg-green-600"
              >
                쿠폰 추가
              </button>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">현재 쿠폰 목록</h3>
              <div className="space-y-2">
                {coupons.map((coupon, index) => (
                  <div key={index} data-testid={`coupon-${index + 1}`} className="rounded bg-gray-100 p-2">
                    {coupon.name} ({coupon.code}):
                    {coupon.discountType === 'amount' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`} 할인
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
