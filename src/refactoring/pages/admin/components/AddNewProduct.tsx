import { Product } from "../../../../types";
import InputField from "../../../components/InputField";

interface Props {
  newProduct: Omit<Product, "id">;
  setNewProduct: (newProduct: Omit<Product, "id">) => void;
  handleAddNewProduct: () => void;
}

export const AddNewProduct = ({
  newProduct,
  setNewProduct,
  handleAddNewProduct,
}: Props) => {
  const updateProductField = (field: keyof Omit<Product, "id">, value: any) => {
    if (newProduct) {
      setNewProduct({ ...newProduct, [field]: value });
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
      <InputField
        label="상품명"
        value={newProduct.name}
        onChange={(e) => updateProductField("name", e.target.value)}
      />
      <InputField
        label="가격"
        value={newProduct.price}
        onChange={(e) => updateProductField("price", parseInt(e.target.value))}
      />
      <InputField
        label="재고"
        value={newProduct.stock}
        onChange={(e) => updateProductField("price", parseInt(e.target.value))}
      />
      <button
        onClick={handleAddNewProduct}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        추가
      </button>
    </div>
  );
};
