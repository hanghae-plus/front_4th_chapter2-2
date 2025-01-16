import { formatPrice } from '@/refactoring/utils/common'

interface OrderSummaryProps {
  totalBeforeDiscount: number
  totalAfterDiscount: number
  totalDiscount: number
}

// 주문 금액
export const OrderSummary = ({ totalBeforeDiscount, totalAfterDiscount, totalDiscount }: OrderSummaryProps) => {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">주문 요약</h2>
      <div className="space-y-1">
        <p>상품 금액: {formatPrice(totalBeforeDiscount)}</p>
        <p className="text-green-600">할인 금액: {formatPrice(totalDiscount)}</p>
        <p className="text-xl font-bold">최종 결제 금액: {formatPrice(totalAfterDiscount)}</p>
      </div>
    </div>
  )
}
