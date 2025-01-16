import { useProducts } from "../../../../../../../hooks";
import Input from "../../../../../../atoms/Input";

export const ProductEditDiscountAddForm = () => {
  const {
    newDiscount,
    handleNewDiscount,
    addProductDiscount,
    editingProduct,
    completeProductEdit,
  } = useProducts();

  if (!editingProduct) {
    return;
  }
  return (
    <div>
      <div className="flex space-x-2">
        <Input
          type="number"
          placeholder="수량"
          value={newDiscount.quantity}
          onChange={(value) => {
            handleNewDiscount({
              ...newDiscount,
              quantity: typeof value === "string" ? parseInt(value) : value,
            });
          }}
        />
        <Input
          type="number"
          placeholder="할인율 (%)"
          value={newDiscount.rate * 100}
          onChange={(value) => {
            handleNewDiscount({
              ...newDiscount,
              rate: typeof value === "string" ? parseInt(value) : value / 100,
            });
          }}
        />

        <button
          onClick={() => addProductDiscount(editingProduct.id)}
          className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          할인 추가
        </button>
      </div>

      <div>
        <button
          onClick={completeProductEdit}
          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
        >
          수정 완료
        </button>
      </div>
    </div>
  );
};
