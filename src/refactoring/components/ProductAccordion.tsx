import { Product } from "../../types";
import { ProductEditForm } from "./ProductEditForm";
import { ProductDiscounts } from "./ProductDiscounts";
import { useOpenProductIds } from "../hooks/useOpenProductIds";
import { useNewDiscount } from "../hooks/useNewDiscount";
import { useEditingProduct } from "../hooks/useEditingProduct";

interface Props {
  product: Product;
  index: number;
  products: Product[];
  onProductAdd: (newProduct: Product) => void;
  onProductUpdate: (updatedProduct: Product) => void;
}

export const ProductAccordion = ({
  product,
  products,
  index,
  onProductUpdate,
}: Props) => {
  // 아코디언 나열 + 아코디언 열려서 정보 보여줌 + 수정 버튼 누를 시 수정 폼 보여줌 + 수정 과정 및 완료 이벤트까지 다룸
  const { openProductIds, toggleProductAccordion } = useOpenProductIds();
  const { newDiscount, setNewDiscount } = useNewDiscount();
  const {
    editingProduct,
    updateProductName,
    updateProductPrice,
    completeProductEdit,
    setEditingProduct,
  } = useEditingProduct();

  const handleProductNameUpdate = (productId: string, newName: string) => {
    updateProductName(productId, newName);
  };

  const handlePriceUpdate = (productId: string, newPrice: number) => {
    updateProductPrice(productId, newPrice);
  };

  // 수정 완료 핸들러 함수 추가
  const handleEditComplete = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      completeProductEdit();
    }
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    // 얘를 통째로 훅으로 집어넣기엔 좀 그렇다. 뭐가 그렇지? 뭐가 찝찝한거지?
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = { ...updatedProduct, stock: newStock };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  };

  const handleAddDiscount = (productId: string) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct && editingProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: [...updatedProduct.discounts, newDiscount],
      };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
      setNewDiscount({ quantity: 0, rate: 0 });
    }
  };

  const handleRemoveDiscount = (productId: string, index: number) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: updatedProduct.discounts.filter((_, i) => i !== index),
      };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  };

  // handleEditProduct 함수 수정
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  return (
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
            <ProductEditForm
              editingProduct={editingProduct}
              productId={product.id}
              onProductNameUpdate={handleProductNameUpdate}
              onDiscountAdd={handleAddDiscount}
              onEditComplete={handleEditComplete}
              onNewDiscountSet={setNewDiscount}
              onProductPriceUpdate={handlePriceUpdate}
              onRemoveDiscount={handleRemoveDiscount}
              onStockUpdate={handleStockUpdate}
              newDiscount={newDiscount}
            />
          ) : (
            <div>
              {product.discounts.map((discount, index) => (
                <ProductDiscounts key={index} discount={discount} />
              ))}
              <button
                data-testid="modify-button"
                onClick={() => handleEditProduct(product)}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
              >
                수정
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
