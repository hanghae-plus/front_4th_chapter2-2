import { Product, Coupon } from "../../types.ts";
import { PageContainer } from "../components/shared";
import CouponSection from "../components/admin/CouponSection.tsx";
import ProductSection from "../components/admin/ProductSection.tsx";

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
    <PageContainer pageTitle="관리자 페이지">
      {/* 오른쪽 */}
      <ProductSection
        products={products}
        onProductUpdate={onProductUpdate}
        onProductAdd={onProductAdd}
      />
      <CouponSection coupons={coupons} onCouponAdd={onCouponAdd} />
    </PageContainer>
  );
};
