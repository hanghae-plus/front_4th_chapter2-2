import { Discount } from "../../types";

interface Props {
  discount: Discount;
}

export const ProductDiscounts = ({ discount }: Props) => {
  return (
    <div className="mb-2">
      <span>
        {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
      </span>
    </div>
  );
};
