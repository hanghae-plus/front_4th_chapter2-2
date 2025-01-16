// CartProductList/ProductPrice.tsx
import { formatCurrency } from "../../../../../utils/formatCurrency";

interface ProductPriceProps {
  price: number;
}

export const ProductPrice = ({ price }: ProductPriceProps) => (
  <span className="text-gray-600">{formatCurrency(price)}원</span>
);
