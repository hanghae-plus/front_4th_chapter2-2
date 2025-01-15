import { Coupon, Product } from "../../types.ts";
import { CouponAdmin } from "./CouponAdmin.tsx";
import { ProductAdmin } from "./ProductAdmin.tsx";

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
  // AdminPage의 관심사: 상품 관리, 쿠폰 관리 모두 관리/보여주기
  // 바꾼다면? 상품 관리, 쿠폰 관리만 보여주자.
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductAdmin
          products={products}
          onProductAdd={onProductAdd}
          onProductUpdate={onProductUpdate}
        />
        <CouponAdmin coupons={coupons} onCouponAdd={onCouponAdd} />
      </div>
    </div>
  );
};
