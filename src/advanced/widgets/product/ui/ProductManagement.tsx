import {
  ProductAddForm,
  ProductManagementItem,
  useGetProductsQuery,
} from '@advanced/features/product';
import { useToggle } from '@advanced/shared/lib';
import { Heading } from '@advanced/shared/ui';

export function ProductManagement() {
  const { data: products } = useGetProductsQuery();
  const { state: showNewProductForm, toggle: toggleShowNewProductForm } =
    useToggle(false);

  return (
    <div>
      <Heading as="h2" className="text-2xl font-semibold mb-4">
        상품 관리
      </Heading>
      <button
        onClick={toggleShowNewProductForm}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
      >
        {showNewProductForm ? '취소' : '새 상품 추가'}
      </button>
      {showNewProductForm && (
        <ProductAddForm onSubmit={toggleShowNewProductForm} />
      )}
      <div className="space-y-2">
        {products.map((product, index) => (
          <ProductManagementItem
            key={product.id}
            product={product}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
