import { useState } from 'react';
import { Coupon, Product } from '../../../types.ts';
import { useAdminProduct } from '../../hooks/useAdminProduct.ts';
import {
  AdminCoupon,
  AdminEditingProduct,
  AdminNewProductForm,
} from './index.ts';

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const AdminPage = ({
  products,
  coupons,
  onProductUpdate,
  onProductAdd,
  onCouponAdd,
}: Props) => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const { newProduct, setNewProduct, handleAddNewProduct } = useAdminProduct({
    products,
    onProductUpdate,
    onProductAdd,
    onAddSuccess: () => setShowNewProductForm(false),
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
          <button
            onClick={() => setShowNewProductForm(!showNewProductForm)}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
          >
            {showNewProductForm ? '취소' : '새 상품 추가'}
          </button>
          {showNewProductForm && (
            <AdminNewProductForm
              newProduct={newProduct}
              setNewProduct={setNewProduct}
              handleAddNewProduct={handleAddNewProduct}
            />
          )}
          <div className="space-y-2">
            {products.map((product, index) => (
              <AdminEditingProduct
                key={product.id}
                products={products}
                product={product}
                index={index}
                onProductUpdate={onProductUpdate}
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
          <AdminCoupon onCouponAdd={onCouponAdd} coupons={coupons} />
        </div>
      </div>
    </div>
  );
};
