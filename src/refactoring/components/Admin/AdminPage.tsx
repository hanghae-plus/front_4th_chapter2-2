import { Coupon, Product } from '../../../types.ts';
import AdminCouponForm from './AdminCouponForm.tsx';
import AdminProductList from './AdminProductList.tsx';
import AdminNewProduct from './AdminNewProduct.tsx';

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
}: Props) => (
  <div className='container mx-auto p-4'>
    <h1 className='text-3xl font-bold mb-6'>관리자 페이지</h1>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      <div>
        <h2 className='text-2xl font-semibold mb-4'>상품 관리</h2>
        <AdminNewProduct onProductAdd={onProductAdd} />
        <AdminProductList productList={productList} onProductUpdate={onProductUpdate} />
      </div>
      <AdminCouponForm couponList={couponList} onCouponAdd={onCouponAdd} />
    </div>
  </div>
);
