import { useState } from 'react';
import { Coupon, Product } from '../../types.ts';
import { CouponManagement } from './coupon/CouponManagement.tsx';
import { Heading } from './shared/Heading.tsx';
import { ProductManagement } from './product/ProductManagement.tsx';

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}

export function AdminPage({
  products,
  coupons,
  onProductUpdate,
  onProductAdd,
  onCouponAdd,
}: Props) {
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
    <div className="container mx-auto p-4">
      <Heading as="h1" className="text-3xl font-bold mb-6">
        관리자 페이지
      </Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductManagement
          products={products}
          onProductUpdate={onProductUpdate}
          onProductAdd={onProductAdd}
        />
        <CouponManagement
          coupons={coupons}
          newCoupon={newCoupon}
          setNewCoupon={setNewCoupon}
          handleAddCoupon={handleAddCoupon}
        />
      </div>
    </div>
  );
}
