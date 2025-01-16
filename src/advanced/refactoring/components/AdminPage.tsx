import React, { useState } from 'react';
import { Coupon } from '../models/types/Coupon';
import ProductForm from './admin/ProductForm';
import ManageCoupon from './admin/ManageCoupon';
import ProductList from './admin/ProductList';

interface Props {
  coupons: Coupon[];
  onCouponAdd: (newCoupon: Coupon) => void;
}

function AdminPage({ coupons, onCouponAdd }: Props) {
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
          <button
            type="button"
            onClick={() => setShowNewProductForm((prev) => !prev)}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
          >
            {showNewProductForm ? '취소' : '새 상품 추가'}
          </button>
          <ProductForm
            isOpen={showNewProductForm}
            setFormState={setShowNewProductForm}
          />
          <ProductList />
        </div>
        <ManageCoupon coupons={coupons} onCouponAdd={onCouponAdd} />
      </div>
    </div>
  );
}

export default AdminPage;
