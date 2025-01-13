import { Coupon, Product } from '../../types';
import CouponManagement from './CouponManagement';
import ProductManagement from './ProductManagement';

interface Props {
  productList: Product[];
  coupons: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const AdminPage = ({
  productList,
  coupons,
  onProductUpdate,
  onProductAdd,
  onCouponAdd,
}: Props) => (
  <div className='container mx-auto p-4'>
    <h1 className='text-3xl font-bold mb-6'>관리자 페이지</h1>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      <ProductManagement
        productList={productList}
        onProductUpdate={onProductUpdate}
        onProductAdd={onProductAdd}
      />
      <CouponManagement coupons={coupons} onCouponAdd={onCouponAdd} />
    </div>
  </div>
);
