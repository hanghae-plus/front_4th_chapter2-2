import { useState } from "react";
import { Discount, Product } from "../../../../types";
import Button from "../../common/Button";
import InputField from "../../common/InputField";
import ProductDiscountForm from "./ProductDiscountForm";

interface ProductUpdateFormProps {
  product: Product;
  onUpdate: (product: Product) => void;
  onClose: (value: React.SetStateAction<string | null>) => void;
}

const ProductUpdateForm = ({
  product,
  onUpdate,
  onClose,
}: ProductUpdateFormProps) => {
  const [editedProduct, setEditedProduct] = useState(product);
  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0,
  });

  const handleFieldUpdate =
    (field: keyof Omit<Product, "id" | "discounts">) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "name" ? e.target.value : parseInt(e.target.value);
      setEditedProduct((prev) => ({ ...prev, [field]: value }));
    };

  const handleAddDiscount = () => {
    setEditedProduct((prev) => ({
      ...prev,
      discounts: [...prev.discounts, newDiscount],
    }));
    setNewDiscount({ quantity: 0, rate: 0 });
  };

  const handleRemoveDiscount = (index: number) => {
    setEditedProduct((prev) => ({
      ...prev,
      discounts: prev.discounts.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-4">
      <InputField
        label="상품명"
        value={editedProduct.name}
        onChange={handleFieldUpdate("name")}
      />
      <InputField
        label="가격"
        type="number"
        value={editedProduct.price}
        onChange={handleFieldUpdate("price")}
      />
      <InputField
        label="재고"
        type="number"
        value={editedProduct.stock}
        onChange={handleFieldUpdate("stock")}
      />
      <ProductDiscountForm
        discounts={editedProduct.discounts}
        newDiscount={newDiscount}
        onNewDiscountChange={setNewDiscount}
        onAddDiscount={handleAddDiscount}
        onRemoveDiscount={handleRemoveDiscount}
      />
      <div className="flex space-x-2">
        <Button
          onClick={() => {
            onUpdate(editedProduct);
            onClose(null);
          }}
          variant="success"
        >
          수정 완료
        </Button>
      </div>
    </div>
  );
};

export default ProductUpdateForm;
