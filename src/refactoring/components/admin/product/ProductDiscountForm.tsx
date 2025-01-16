import { Discount } from "../../../../types";
import Input from "../../common/Input";
import Button from "../../common/Button";

interface ProductDiscountFormProps {
  discounts: Array<Discount>;
  newDiscount: Discount;
  onNewDiscountChange: (newDiscount: Discount) => void;
  onAddDiscount: () => void;
  onRemoveDiscount: (index: number) => void;
}

const ProductDiscountForm = ({
  discounts,
  newDiscount,
  onNewDiscountChange,
  onAddDiscount,
  onRemoveDiscount,
}: ProductDiscountFormProps) => {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
      {discounts.map((discount, index) => (
        <div key={index} className="flex justify-between items-center mb-2">
          <span>
            {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
          </span>
          <Button
            onClick={() => onRemoveDiscount(index)}
            className="py-1"
            variant="danger"
          >
            삭제
          </Button>
        </div>
      ))}
      <div className="flex space-x-2">
        <Input
          type="number"
          placeholder="수량"
          value={newDiscount.quantity}
          onChange={(e) =>
            onNewDiscountChange({
              ...newDiscount,
              quantity: parseInt(e.target.value),
            })
          }
          className="w-1/3 p-2 border rounded"
        />
        <Input
          type="number"
          placeholder="할인율 (%)"
          value={newDiscount.rate * 100}
          onChange={(e) =>
            onNewDiscountChange({
              ...newDiscount,
              rate: parseInt(e.target.value) / 100,
            })
          }
          className="w-1/3 p-2 border rounded"
        />
        <Button onClick={onAddDiscount} type="button" className="w-1/3 p-2">
          할인 추가
        </Button>
      </div>
    </div>
  );
};

export default ProductDiscountForm;
