import { useState } from "react";
import { Product } from "../../../../types";
import InputField from "../../common/InputField";
import Button from "../../common/Button";

interface ProductFormProps {
  onSubmit: (product: Omit<Product, "id">) => void;
}

const INIT_PRODUCT = {
  name: "",
  price: 0,
  stock: 0,
  discounts: [],
};

const ProductForm = ({ onSubmit }: ProductFormProps) => {
  const [formData, setFormData] = useState<Omit<Product, "id">>(INIT_PRODUCT);

  const handleChange =
    (field: keyof Omit<Product, "id" | "discounts">) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "name" ? e.target.value : parseInt(e.target.value);
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
      <div className="mb-2">
        <InputField
          id="productName"
          label="상품명"
          value={formData.name}
          onChange={handleChange("name")}
        />
        <InputField
          id="productPrice"
          label="가격"
          type="number"
          value={formData.price}
          onChange={handleChange("price")}
        />
        <InputField
          id="productStock"
          label="재고"
          type="number"
          value={formData.stock}
          onChange={handleChange("stock")}
        />
        <Button onClick={() => onSubmit(formData)} className="w-full p-2">
          추가
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;
