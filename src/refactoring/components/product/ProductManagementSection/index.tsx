import { Product } from "../../../../types";
import { useProductManagement } from "../../../hooks/useProductManager";
import ProductAddForm from "./fragments/ProductAddForm";
import ProductEditForm from "./fragments/ProductEditForm";

interface ProductManagementSectionProps {
  products: Product[];
  onProductUpdate: (product: Product) => void;
  onProductAdd: (product: Product) => void;
}

function ProductManagementSection(props: ProductManagementSectionProps) {
  const { products, onProductUpdate, onProductAdd } = props;

  const {
    openProductIds,
    editingProduct,
    newDiscount,
    showNewProductForm,
    newProduct,
    toggleProductAccordion,
    setNewProduct,
    handleEditProduct,
    handleProductNameUpdate,
    handlePriceUpdate,
    handleEditComplete,
    handleStockUpdate,
    handleAddDiscount,
    handleRemoveDiscount,
    handleAddNewProduct,
    setShowNewProductForm,
    setNewDiscount,
  } = useProductManagement({ products, onProductUpdate, onProductAdd });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
      <button
        onClick={() => setShowNewProductForm(!showNewProductForm)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
      >
        {showNewProductForm ? "취소" : "새 상품 추가"}
      </button>
      {showNewProductForm && (
        <ProductAddForm
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          handleAddNewProduct={handleAddNewProduct}
        />
      )}
      <ProductEditForm
        newDiscount={newDiscount}
        setNewDiscount={setNewDiscount}
        products={products}
        openProductIds={openProductIds}
        toggleProductAccordion={toggleProductAccordion}
        editingProduct={editingProduct}
        handleEditProduct={handleEditProduct}
        handleProductNameUpdate={handleProductNameUpdate}
        handlePriceUpdate={handlePriceUpdate}
        handleStockUpdate={handleStockUpdate}
        handleAddDiscount={handleAddDiscount}
        handleRemoveDiscount={handleRemoveDiscount}
        handleEditComplete={handleEditComplete}
      />
    </div>
  );
}

export default ProductManagementSection;
