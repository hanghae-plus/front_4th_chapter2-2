import React from 'react';

import { ProductList } from '../components/admin/ProductList';
import { ProductForm } from '../components/admin/ProductForm';
import { CouponManager } from '../components/admin/CouponManager';
import { Coupon, Product } from '../../types';
import { useCouponsManagement } from '../hooks/useCouponsManagement';
import { useProductsManagement } from '../hooks/useProductsMangement';
interface AdminPageProps {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (product: Product) => void;
  onProductAdd: (product: Product) => void;
  onCouponAdd: (coupon: Coupon) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  coupons,
  onProductUpdate,
  onProductAdd,
  onCouponAdd,
}) => {
  const { newProduct, setNewProduct, showNewProductForm, setShowNewProductForm } =
    useProductsManagement(products, onProductUpdate, onProductAdd);

  const { newCoupon, setNewCoupon, handleAddCoupon } = useCouponsManagement(onCouponAdd);

  const handleAddNewProduct = () => {
    if (newProduct.name && newProduct.price > 0) {
      onProductAdd({
        ...newProduct,
        id: Date.now().toString(),
      });
      setNewProduct({
        id: '',
        name: '',
        price: 0,
        stock: 0,
        discounts: [],
      });
      setShowNewProductForm(false);
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>관리자 페이지</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <h2 className='text-2xl font-semibold mb-4'>상품 관리</h2>

          <ProductForm
            showForm={showNewProductForm}
            onToggleForm={() => setShowNewProductForm(!showNewProductForm)}
            newProduct={newProduct}
            onProductChange={setNewProduct}
            onSubmit={handleAddNewProduct}
          />

          <ProductList products={products} onProductUpdate={onProductUpdate} />
        </div>

        <CouponManager
          coupons={coupons}
          newCoupon={newCoupon}
          onCouponChange={setNewCoupon}
          onAddCoupon={handleAddCoupon}
        />
      </div>
    </div>
  );
};
