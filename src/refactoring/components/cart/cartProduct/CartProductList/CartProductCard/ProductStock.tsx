// CartProductList/ProductStock.tsx
interface ProductStockProps {
  remainingStock: number;
  discounts: { quantity: number; rate: number }[];
}

export const ProductStock = ({ remainingStock, discounts }: ProductStockProps) => {
  const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
    return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
  };

  return (
    <div className="text-sm text-gray-500 mb-2">
      <span className={`font-medium ${remainingStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
        재고: {remainingStock}개
      </span>
      {discounts.length > 0 && (
        <span className="ml-2 font-medium text-blue-600">
          최대 {(getMaxDiscount(discounts) * 100).toFixed(0)}% 할인
        </span>
      )}
    </div>
  );
};
