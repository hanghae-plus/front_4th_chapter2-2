import { Coupon, Product } from "../../types";
import { ProductList } from "./adminpage/AdminProductList";
import { CouponList } from "./adminpage/AdminCouponList";
import { CouponForm } from "./adminpage/AdminCouponForm";

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const AdminPage = ({ products, coupons, onProductUpdate, onCouponAdd }: Props) => {

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductList 
          products={products} 
          onProductUpdate={onProductUpdate} 
        />
        <div>
          <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
          <CouponForm onCouponAdd={onCouponAdd} />
          <CouponList coupons={coupons} />
        </div>
      </div>
    </div>
  );
};
