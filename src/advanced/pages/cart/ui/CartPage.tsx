import { CartDetail } from '@advanced/widgets/cart';
import { ProductList } from '@advanced/widgets/product';
import { Heading } from '@advanced/shared/ui';

export function CartPage() {
  return (
    <div className="container mx-auto p-4">
      <Heading as="h1" className="text-3xl font-bold mb-6">
        장바구니
      </Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductList />
        <CartDetail />
      </div>
    </div>
  );
}
