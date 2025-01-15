import { Product } from "../../../../types";
import { useProductToggleButton } from "../hooks/useProductToggleButton";
import ProductDetails from "./ProductDetails";
import UpdateProductForm from "./UpdateProductForm";

interface Props {
  products: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
}

const ProductToggleButton = ({ products, onProductUpdate }: Props) => {
  const {
    openProductIds,
    editingProduct,
    newDiscount,
    setNewDiscount,
    toggleProductAccordion,
    handleEditProduct,
    updateProductField,
    handleEditComplete,
    handleAddDiscount,
    handleRemoveDiscount,
  } = useProductToggleButton(products, onProductUpdate);

  return (
    <div className="space-y-2">
      {products.map((product, index) => (
        <div
          key={product.id}
          data-testid={`product-${index + 1}`}
          className="bg-white p-4 rounded shadow"
        >
          <button
            data-testid="toggle-button"
            onClick={() => toggleProductAccordion(product.id)}
            className="w-full text-left font-semibold"
          >
            {product.name} - {product.price}원 (재고: {product.stock})
          </button>
          {openProductIds.has(product.id) && (
            <div className="mt-2">
              {editingProduct && editingProduct.id === product.id ? (
                <UpdateProductForm
                  product={product}
                  editingProduct={editingProduct}
                  newDiscount={newDiscount}
                  setNewDiscount={setNewDiscount}
                  updateProductField={updateProductField}
                  handleRemoveDiscount={handleRemoveDiscount}
                  handleAddDiscount={handleAddDiscount}
                  handleEditComplete={handleEditComplete}
                />
              ) : (
                <ProductDetails 
                  product={product}
                  handleEditProduct={handleEditProduct}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductToggleButton;
