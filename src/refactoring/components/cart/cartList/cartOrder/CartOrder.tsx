import { formatCurrency } from "../../../../utils/formatCurrency";
import Title from "../../../atoms/Title";

interface OrderSummaryProps {
  totalBeforeDiscount: number;
  totalDiscount: number;
  totalAfterDiscount: number;
}

export const CartOrder = ({
  totalBeforeDiscount,
  totalDiscount,
  totalAfterDiscount,
}: OrderSummaryProps) => {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <Title level={2} mbNum={2} text="주문 요약" />
      <div className="space-y-1">
        <p>상품 금액: {formatCurrency(totalBeforeDiscount)}원</p>
        <p className="text-green-600">
          할인 금액: {formatCurrency(totalDiscount)}원
        </p>
        <p className="text-xl font-bold">
          최종 결제 금액: {formatCurrency(totalAfterDiscount)}원
        </p>
      </div>
    </div>
  );
};
