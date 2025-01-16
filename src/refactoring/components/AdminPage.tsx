import Title from "../components/atoms/Title.tsx";
import { CouponManagement } from "./admin/couponManagement/CouponManagement.tsx";
import { ProductManagement } from "./admin/productManagement/ProductManagement.tsx";

export const AdminPage = () => {
  return (
    <div className="container mx-auto p-4">
      <Title level={1} text={"관리자 페이지"} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Title level={2} mbNum={4} text="상품 관리" />
          <ProductManagement />
        </div>
        <div>
          <Title level={2} mbNum={4} text="쿠폰 관리" />
          <CouponManagement />
        </div>
      </div>
    </div>
  );
};
