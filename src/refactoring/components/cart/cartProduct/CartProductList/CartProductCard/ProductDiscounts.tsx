interface ProductDiscountsProps {
  discounts: { quantity: number; rate: number }[];
}

export const ProductDiscounts = ({ discounts }: ProductDiscountsProps) => {
  if (discounts.length === 0) return null;

  return (
    <ul className="list-disc list-inside text-sm text-gray-500 mb-2">
      {discounts.map((discount, index) => (
        <li key={index}>
          {discount.quantity}개 이상: {(discount.rate * 100).toFixed(0)}% 할인
        </li>
      ))}
    </ul>
  );
};
