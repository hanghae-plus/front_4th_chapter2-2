import { ManageProduct } from "./admin/ManageProduct.tsx";
import { ManageCoupon } from "./admin/ManageCoupon.tsx";
import { Product, Coupon } from "../../types.ts";

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (product: Product) => void;
  onProductAdd: (product: Product) => void;
  onCouponAdd: (coupon: Coupon) => void;
}

export const AdminPage = ({
  products,
  coupons, 
  onProductUpdate,
  onProductAdd, 
  onCouponAdd,
}: Props) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ManageProduct 
          products={products} 
          onProductUpdate={onProductUpdate}
          onProductAdd={onProductAdd}
        />
        <ManageCoupon 
          coupons={coupons}
          onCouponAdd={onCouponAdd}
        />
      </div>
    </div>
  );
};
