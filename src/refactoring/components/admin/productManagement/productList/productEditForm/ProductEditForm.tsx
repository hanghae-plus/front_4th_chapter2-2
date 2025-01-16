import { useProducts } from "../../../../../hooks";
import { ProductDiscount } from "./productDiscount/ProductDiscount";
import { ProductEditDiscount } from "./productEditInput/ProductEditDiscount";
import { ProductEditDiscountAddForm } from "./productEditInput/productEditDiscountAddForm/ProductEditDiscountAddForm";
import { ProductEditInput } from "./productEditInput/ProductEditInput";

export interface ProductEditFormProps {
  productId: string;
}

export const ProductEditForm = ({ productId }: ProductEditFormProps) => {
  const { editingProduct } = useProducts();
  const isEditing = editingProduct?.id === productId;

  return (
    <div>
      {isEditing ? (
        <div className="mt-2">
          <ProductEditInput />
          <ProductEditDiscount />
          <ProductEditDiscountAddForm />
        </div>
      ) : (
        <div>
          <ProductDiscount productId={productId} />
        </div>
      )}
    </div>
  );
};
