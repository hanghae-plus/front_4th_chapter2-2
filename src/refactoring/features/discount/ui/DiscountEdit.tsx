import { IDiscount } from '../../../shared/types';

interface IDiscountEditProps {
  discounts: IDiscount[];
  newDiscount: IDiscount;
  setNewDiscount: (newDiscount: IDiscount) => void;
  handleAddDiscount: () => void;
  handleRemoveDiscount: (index: number) => void;
}

export function DiscountEdit({
  discounts,
  newDiscount,
  setNewDiscount,
  handleRemoveDiscount,
  handleAddDiscount,
}: IDiscountEditProps) {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
      {discounts.map((discount, index) => (
        <div key={index} className="flex justify-between items-center mb-2">
          <span>
            {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
          </span>
          <button
            onClick={() => handleRemoveDiscount(index)}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            삭제
          </button>
        </div>
      ))}
      <div className="flex space-x-2">
        <input
          type="number"
          placeholder="수량"
          value={newDiscount.quantity}
          onChange={(e) =>
            setNewDiscount({
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
            setNewDiscount({
              ...newDiscount,
              rate: parseInt(e.target.value) / 100,
            })
          }
          className="w-1/3 p-2 border rounded"
        />
        <button
          onClick={() => handleAddDiscount()}
          className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          할인 추가
        </button>
      </div>
    </div>
  );
}
