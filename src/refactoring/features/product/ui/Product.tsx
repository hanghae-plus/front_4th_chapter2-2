import { ProductDetail } from './ProductDetail.tsx';
import { useProductContext } from '../../../entities/product/model';
import { IProduct } from '../../../shared/types';
import { useProductAccordion } from '../model';

interface IProductProps {
  index: number;
  productId: string;
}

export function Product({ index, productId }: IProductProps) {
  const { findProduct } = useProductContext();
  const product = findProduct(productId) as IProduct;
  const { openProductIds, toggleProductAccordion } = useProductAccordion();

  return (
    <div
      data-testid={`product-${index + 1}`}
      className="bg-white p-4 rounded shadow"
    >
      <button
        data-testid="toggle-button"
        onClick={() => toggleProductAccordion(product.id)}
        className="w-full text-left font-semibold"
      >
        {product.name} - {product.price}원 (재고: {product.stock})
      </button>
      {openProductIds.has(product.id) && (
        <ProductDetail productId={productId} />
      )}
    </div>
  );
}
