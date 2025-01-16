import { Coupon, Product } from "../../types.ts";
import { AddProductForm } from "./AddProductForm/AddProductForm.tsx";
import { StockProduct } from "./StockProduct/StockProduct.tsx";
import { AddCouponForm } from "./Coupon/AddCouponForm.tsx";
import { CouponList } from "./Coupon/CouponList.tsx";

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
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
          <AddProductForm onSubmitAddProduct={onProductAdd} />
          <div className="space-y-2">
            {products.map((product, index) => (
              <StockProduct
                product={product}
                index={index}
                onEditComplete={onProductUpdate}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
          <div className="bg-white p-4 rounded shadow">
            <AddCouponForm onSubmitAddCoupon={onCouponAdd} />
            <div>
              <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
              <CouponList coupons={coupons} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
