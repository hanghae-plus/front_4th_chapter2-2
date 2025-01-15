import { Coupon, Product } from '../../types.ts';
import { AdminProductManagementWrapper } from './admin/AdminProductManagementWrapper.tsx';
import { AdminNewProduct } from './admin/AdminNewProduct.tsx';
import { AdminProductList } from './admin/AdminProductList.tsx';
import { AdminNewCoupon } from './admin/AdminNewCoupon.tsx';
import { AdminCouponList } from './admin/AdminCouponList.tsx';

interface Props {
  productList: Product[];
  couponList: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const AdminPage = ({
  productList,
  couponList,
  onProductUpdate,
  onProductAdd,
  onCouponAdd,
}: Props) => {
  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>관리자 페이지</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <AdminProductManagementWrapper>
          <AdminNewProduct onProductAdd={onProductAdd} />
          <AdminProductList onProductUpdate={onProductUpdate} productList={productList} />
        </AdminProductManagementWrapper>
        <div>
          <h2 className='text-2xl font-semibold mb-4'>쿠폰 관리</h2>
          <div className='bg-white p-4 rounded shadow'>
            <AdminNewCoupon onCouponAdd={onCouponAdd} />
            <AdminCouponList couponList={couponList} />
          </div>
        </div>
      </div>
    </div>
  );
};
