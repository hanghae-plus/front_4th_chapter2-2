import { Product } from "../../types";
import { ProductAccordion } from "./ProductAccordion";
import { ProductAddForm } from "./ProductAddForm";
import { useShowNewProductForm } from "../hooks/useShowNewProductForm";

interface Props {
  products: Product[];
  onProductAdd: (newProduct: Product) => void;
  onProductUpdate: (updatedProduct: Product) => void;
}

// 얘의 역할: showNewProductForm에 따라 새 상품 추가 폼을 보여준다 + ProductAccordion을 보여준다.
export const ProductAdmin = ({
  products,
  onProductAdd,
  onProductUpdate,
}: Props) => {
  const { showNewProductForm, changeShowNewProductForm } =
    useShowNewProductForm();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
      <button
        onClick={() => changeShowNewProductForm(!showNewProductForm)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
      >
        {showNewProductForm ? "취소" : "새 상품 추가"}
      </button>
      {showNewProductForm && (
        <ProductAddForm
          onProductAdd={onProductAdd}
          onChangeShowNewProductForm={changeShowNewProductForm}
        />
      )}
      <div className="space-y-2">
        {products.map((product, index) => (
          <ProductAccordion
            product={product}
            products={products}
            index={index}
            onProductAdd={onProductAdd}
            onProductUpdate={onProductUpdate}
          />
        ))}
      </div>
    </div>
  );
};
