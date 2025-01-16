import { useProducts } from "../../../../../../hooks";
import { useForm } from "../../../../../../hooks/useForm";
import Input from "../../../../../atoms/Input";

export const ProductEditInput = () => {
  const { editingProduct } = useProducts();
  const { handleEditingProductInput, handleProductStock } = useForm();

  if (!editingProduct) {
    return;
  }

  const productId = editingProduct?.id;
  return (
    <div>
      <div className="mb-4">
        <label className="block mb-1">상품명: </label>
        <Input
          id="productName"
          value={editingProduct?.name}
          onChange={(value) =>
            handleEditingProductInput(productId, "name", value.toString())
          }
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">가격: </label>
        <Input
          type="number"
          value={editingProduct?.price}
          onChange={(value) => {
            handleEditingProductInput(
              productId,
              "price",
              typeof value === "string" ? parseInt(value) : value
            );
          }}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">재고: </label>
        <Input
          type="number"
          value={editingProduct?.stock}
          onChange={(value) => {
            handleProductStock(
              productId,
              typeof value === "string" ? parseInt(value) : value
            );
          }}
        />
      </div>
    </div>
  );
};
