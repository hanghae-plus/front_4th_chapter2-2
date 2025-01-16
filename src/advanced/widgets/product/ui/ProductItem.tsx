import { AddToCartButton } from '@advanced/features/cart';
import {
  getMaxDiscount,
  Product,
  ProductDiscountList,
} from '@advanced/entities/product';
import { ProductStock } from './ProductStock';

interface ProductItemProps {
  product: Product;
}

export function ProductItem({ product }: ProductItemProps) {
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
        <ProductStock product={product} />
        {product.discounts.length > 0 && (
          <span className="ml-2 font-medium text-blue-600">
            최대 {(getMaxDiscount(product.discounts) * 100).toFixed(0)}% 할인
          </span>
        )}
      </div>
      {product.discounts.length > 0 && (
        <ProductDiscountList discounts={product.discounts} />
      )}
      <AddToCartButton product={product} />
    </div>
  );
}
