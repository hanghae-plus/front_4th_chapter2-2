import { Discount, Product } from "../../types";
import { DiscountEditForm } from "./DiscountEditForm";

interface Props {
  editingProduct: Product;
  productId: string;
  onProductNameUpdate: (productId: string, name: string) => void;
  onProductPriceUpdate: (productId: string, price: number) => void;
  onStockUpdate: (productId: string, stock: number) => void;
  onEditComplete: () => void;
  onDiscountAdd: (productId: string) => void;
  onNewDiscountSet: (newDiscount: Discount) => void;
  onRemoveDiscount: (productId: string, index: number) => void;
  newDiscount: Discount;
}

export const ProductEditForm = ({
  editingProduct,
  productId,
  onProductNameUpdate,
  onProductPriceUpdate,
  onStockUpdate,
  onEditComplete,
  onDiscountAdd,
  newDiscount,
  onNewDiscountSet,
  onRemoveDiscount,
}: Props) => {
  return (
    <div>
      <div className="mb-4">
        <label className="block mb-1">상품명: </label>
        <input
          type="text"
          value={editingProduct.name}
          onChange={(e) => onProductNameUpdate(productId, e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">가격: </label>
        <input
          type="number"
          value={editingProduct.price}
          onChange={(e) =>
            onProductPriceUpdate(productId, parseInt(e.target.value))
          }
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">재고: </label>
        <input
          type="number"
          value={editingProduct.stock}
          onChange={(e) => onStockUpdate(productId, parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      {/* 할인 정보 수정 부분 */}
      <DiscountEditForm
        productId={productId}
        editingProductDiscounts={editingProduct.discounts}
        onDiscountAdd={onDiscountAdd}
        newDiscount={newDiscount}
        onNewDiscountSet={onNewDiscountSet}
        onRemoveDiscount={onRemoveDiscount}
      />
      <button
        onClick={onEditComplete}
        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
      >
        수정 완료
      </button>
    </div>
  );
};
