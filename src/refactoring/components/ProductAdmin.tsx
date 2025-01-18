import { ProductAccordion } from "./ProductAccordion";
import { ProductAddForm } from "./ProductAddForm";
import { useShowNewProductForm } from "../hooks/useShowNewProductForm";
import { useProductsContext } from "../contexts/ProductsContext";

interface Props {}

// 얘의 역할: showNewProductForm에 따라 새 상품 추가 폼을 보여준다 + ProductAccordion을 보여준다.
export const ProductAdmin = ({}: Props) => {
  const { products } = useProductsContext();
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
        <ProductAddForm onChangeShowNewProductForm={changeShowNewProductForm} />
      )}
      <div className="space-y-2">
        {products.map((product, index) => (
          <ProductAccordion product={product} index={index} key={index} />
        ))}
      </div>
    </div>
  );
};
