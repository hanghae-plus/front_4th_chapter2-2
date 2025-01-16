import { Discount, Product } from "../../types";
import { EditingProductDiscounts } from "./EditingProductDiscounts";

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
      <div>
        <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
        {editingProduct.discounts.map((discount, index) => (
          <EditingProductDiscounts
            key={index}
            index={index}
            discount={discount}
            productId={productId}
            handleRemoveDiscount={onRemoveDiscount}
          />
        ))}
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="수량"
            value={newDiscount.quantity}
            onChange={(e) =>
              onNewDiscountSet({
                ...newDiscount,
                quantity: parseInt(e.target.value),
              })
            }
            className="w-1/3 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="할인율 (%)"
            value={newDiscount.rate * 100}
            onChange={(e) =>
              onNewDiscountSet({
                ...newDiscount,
                rate: parseInt(e.target.value) / 100,
              })
            }
            className="w-1/3 p-2 border rounded"
          />
          <button
            onClick={() => onDiscountAdd(productId)}
            className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            할인 추가
          </button>
        </div>
      </div>
      <button
        onClick={onEditComplete}
        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
      >
        수정 완료
      </button>
    </div>
  );
};
