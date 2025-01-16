import { getRemainingStock, useCart } from '@advanced/features/cart';
import {
  getMaxDiscount,
  Product,
  ProductDiscountList,
} from '@advanced/entities/product';

interface ProductItemProps {
  product: Product;
}

export function ProductItem({ product }: ProductItemProps) {
  const cart = useCart((state) => state.cart);
  const addToCart = useCart((state) => state.addToCart);
  const remainingStock = getRemainingStock(cart, product);

  return (
    <div
      data-testid={`product-${product.id}`}
      className="bg-white p-3 rounded shadow"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{product.name}</span>
        <span className="text-gray-600">
          {product.price.toLocaleString()}원
        </span>
      </div>
      <div className="text-sm text-gray-500 mb-2">
        <span
          className={`font-medium ${remainingStock > 0 ? 'text-green-600' : 'text-red-600'}`}
        >
          재고: {remainingStock}개
        </span>
        {product.discounts.length > 0 && (
          <span className="ml-2 font-medium text-blue-600">
            최대 {(getMaxDiscount(product.discounts) * 100).toFixed(0)}% 할인
          </span>
        )}
      </div>
      {product.discounts.length > 0 && (
        <ProductDiscountList discounts={product.discounts} />
      )}
      <button
        onClick={() => addToCart(product)}
        className={`w-full px-3 py-1 rounded ${
          remainingStock > 0
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        disabled={remainingStock <= 0}
      >
        {remainingStock > 0 ? '장바구니에 추가' : '품절'}
      </button>
    </div>
  );
}
