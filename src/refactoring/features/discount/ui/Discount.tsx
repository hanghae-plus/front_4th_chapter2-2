import { IDiscount, IProduct } from '../../../shared/types';

interface DiscountProps {
  index: number;
  discount: IDiscount;
  setEditingProduct: React.Dispatch<React.SetStateAction<IProduct>>;
}

export function Discount({
  index,
  discount,
  setEditingProduct,
}: DiscountProps) {
  const handleRemoveDiscount = (index: number) => {
    setEditingProduct((prev) => ({
      ...prev,
      discounts: prev.discounts.filter((_, i) => i !== index),
    }));
  };

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
