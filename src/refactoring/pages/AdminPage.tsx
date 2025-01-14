import { useState } from "react";
import { Coupon, Product } from "../../types";
import Button from "../components/common/Button";
import CouponContainer from "../components/admin/coupon/CouponContainer";
import ProductList from "../components/admin/product/ProductList";
import Container from "../components/layout/Container";
import ContentSection from "../components/layout/ContentSection";
import ProductForm from "../components/admin/product/ProductForm";

interface AdminPageProps {
  products: Array<Product>;
  coupons: Array<Coupon>;
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
}: AdminPageProps) => {
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleAddNewProduct = (newProduct: Omit<Product, "id">) => {
    const productWithId = {
      ...newProduct,
      id: Date.now().toString(),
    };
    onProductAdd(productWithId);
    setShowNewProductForm(false);
  };

  return (
    <Container title="관리자 페이지">
      <ContentSection subTitle="상품 관리">
        <Button
          onClick={() => setShowNewProductForm(!showNewProductForm)}
          variant="success"
          className="mb-4"
        >
          {showNewProductForm ? "취소" : "새 상품 추가"}
        </Button>

        {showNewProductForm && <ProductForm onSubmit={handleAddNewProduct} />}

        <ProductList
          products={products}
          openProductIds={openProductIds}
          editingProductId={editingProductId}
          onToggleAccordion={toggleProductAccordion}
          onStartEdit={setEditingProductId}
          onProductUpdate={onProductUpdate}
        />
      </ContentSection>

      <ContentSection subTitle="쿠폰 관리">
        <CouponContainer coupons={coupons} onAddCoupon={onCouponAdd} />
      </ContentSection>
    </Container>
  );
};
