import { SectionTitle } from '../../../shared/ui/typography';
import { Stock } from '../../../features/stock/ui/Stock.tsx';
import { useProductContext } from '../../../entities/product/model';

export function ProductList() {
  const { products } = useProductContext();

  return (
    <div>
      <SectionTitle title={'상품 목록'} />
      <div className="space-y-2">
        {products.map((product) => (
          <Stock key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
