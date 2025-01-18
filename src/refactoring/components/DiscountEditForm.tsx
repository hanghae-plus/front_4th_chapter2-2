import { Discount } from "../../types";
import { EditingProductDiscounts } from "./EditingProductDiscounts";

interface Props {
  editingProductDiscounts: Discount[];
  productId: string;
  onRemoveDiscount: (productId: string, index: number) => void;
  newDiscount: Discount;
  onNewDiscountSet: (newDiscount: Discount) => void;
  onDiscountAdd: (productId: string) => void;
}

export const DiscountEditForm = ({
  editingProductDiscounts,
  productId,
  onRemoveDiscount,
  newDiscount,
  onNewDiscountSet,
  onDiscountAdd,
}: Props) => {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
      {editingProductDiscounts.map((discount, index) => (
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
  );
};
