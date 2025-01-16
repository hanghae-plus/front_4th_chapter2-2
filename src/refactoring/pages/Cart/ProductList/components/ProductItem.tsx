import { getMaxDiscount } from '@/refactoring/models/discount';
import { getRemainingStock } from '@/refactoring/models/stock';
import type { CartItem, Product } from '@/types';

interface ProductItemProps {
  product: Product;
  cart: CartItem[];
  onCartAdd: (product: Product) => void;
}

export const ProductItem = ({ product, cart, onCartAdd }: ProductItemProps) => {
  const remainingStock = getRemainingStock(product, cart);
  const isSoldOut = remainingStock <= 0;

  const maxDiscount = getMaxDiscount(product.discounts);
  const hasDiscountInfo = product.discounts.length > 0;

  const handleAddToCart = (product: Product) => () => {
    if (isSoldOut) return;
    onCartAdd(product);
  };

  return (
    <div key={product.id} data-testid={`product-${product.id}`} className="rounded bg-white p-3 shadow">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold">{product.name}</span>
        <span className="text-gray-600">{product.price.toLocaleString()}원</span>
      </div>

      <div className="mb-2 text-sm text-gray-500">
        <span className={`font-medium ${remainingStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          재고: {remainingStock}개
        </span>
        {hasDiscountInfo && (
          <span className="ml-2 font-medium text-blue-600">최대 {(maxDiscount * 100).toFixed(0)}% 할인</span>
        )}
      </div>

      {hasDiscountInfo && (
        <ul className="mb-2 list-inside list-disc text-sm text-gray-500">
          {product.discounts.map((discount, index) => (
            <li key={index}>
              {discount.quantity}개 이상: {(discount.rate * 100).toFixed(0)}% 할인
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleAddToCart(product)}
        className={`w-full rounded px-3 py-1 ${
          remainingStock > 0
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'cursor-not-allowed bg-gray-300 text-gray-500'
        }`}
        disabled={isSoldOut}
      >
        {remainingStock > 0 ? '장바구니에 추가' : '품절'}
      </button>
    </div>
  );
};
