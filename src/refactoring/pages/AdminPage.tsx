import { Coupon, Product } from '../../types';
import { CouponForm } from '../components/Admin/CouponForm';
import { CouponList } from '../components/Admin/CouponList';
import { ProductForm } from '../components/Admin/ProductForm';
import { ProductList } from '../components/Admin/ProductList';

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
        <div>
          <h2 className='text-2xl font-semibold mb-4'>상품 관리</h2>
          <ProductForm productList={productList} onProductAdd={onProductAdd} />
          <ProductList productList={productList} onProductUpdate={onProductUpdate} />
        </div>
        <div>
          <h2 className='text-2xl font-semibold mb-4'>쿠폰 관리</h2>
          <CouponForm couponList={couponList} onCouponAdd={onCouponAdd} />
          <CouponList couponList={couponList} />
        </div>
      </div>
    </div>
  );
};
