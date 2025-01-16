import { Product } from "../../../../../types";
import { useCart } from "../../../../hooks";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { AddToCartButton } from "../AddToCartButton/AddToCartButton";

interface CartProductCardProps {
  products: Product[];
}

export const CartProductCard = ({ products }: CartProductCardProps) => {
  const { getRemainingStock } = useCart();
  const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
    return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
  };
  return (
    <div className="space-y-2">
      {products.map((product) => {
        const remainingStock = getRemainingStock(product);
        return (
          <div
            key={product.id}
            data-testid={`product-${product.id}`}
            className="bg-white p-3 rounded shadow"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{product.name}</span>
              <span className="text-gray-600">
                {formatCurrency(product.price)}원
              </span>
            </div>
            <div className="text-sm text-gray-500 mb-2">
              <span
                className={`font-medium ${
                  remainingStock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                재고: {remainingStock}개
              </span>
              {product.discounts.length > 0 && (
                <span className="ml-2 font-medium text-blue-600">
                  최대 {(getMaxDiscount(product.discounts) * 100).toFixed(0)}%
                  할인
                </span>
              )}
            </div>
            {product.discounts.length > 0 && (
              <ul className="list-disc list-inside text-sm text-gray-500 mb-2">
                {product.discounts.map((discount, index) => (
                  <li key={index}>
                    {discount.quantity}개 이상:{" "}
                    {(discount.rate * 100).toFixed(0)}% 할인
                  </li>
                ))}
              </ul>
            )}
            <AddToCartButton
              product={product}
              remainingStock={remainingStock}
            />
          </div>
        );
      })}
    </div>
  );
};
