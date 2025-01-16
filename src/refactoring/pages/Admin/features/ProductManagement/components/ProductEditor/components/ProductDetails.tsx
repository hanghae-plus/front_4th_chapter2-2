import type { Product } from '@/types';

interface ProductDetailsProps {
  product: Product;
  onEditStart: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ProductDetails = ({ product, onEditStart }: ProductDetailsProps) => {
  return (
    <div>
      {product.discounts.map((discount, index) => (
        <div key={index} className="mb-2">
          <span>
            {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
          </span>
        </div>
      ))}
      <button
        data-testid="modify-button"
        onClick={onEditStart}
        className="mt-2 rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
      >
        수정
      </button>
    </div>
  );
};
