import { useEditingProductContext } from '../../product/model';

interface DiscountProps {
  index: number;
}

export function Discount({ index }: DiscountProps) {
  const { editingProduct, handleRemoveDiscount } = useEditingProductContext();
  const discount = editingProduct.discounts[index];

  return (
    <div className="flex justify-between items-center mb-2">
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
  );
}
