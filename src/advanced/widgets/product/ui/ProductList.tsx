import { useGetProductsQuery } from '@advanced/features/product';
import { Heading } from '@advanced/shared/ui';
import { ProductItem } from './ProductItem';

export function ProductList() {
  const { data: products } = useGetProductsQuery();

  return (
    <div>
      <Heading as="h2" className="text-2xl font-semibold mb-4">
        상품 목록
      </Heading>
      <div className="space-y-2">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
