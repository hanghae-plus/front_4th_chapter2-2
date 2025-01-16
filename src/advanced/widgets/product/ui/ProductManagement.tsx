import { Suspense, useState } from 'react';
import {
  ProductAddForm,
  ProductEditForm,
  useGetProductsQuery,
} from '@advanced/features/product';
import { Heading } from '@advanced/shared/ui';

export function ProductManagement() {
  const { data: products } = useGetProductsQuery();
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleEditProduct = (productId: string) => {
    setEditingProductId(productId);
  };

  return (
    <div>
      <Heading as="h2" className="text-2xl font-semibold mb-4">
        상품 관리
      </Heading>
      <button
        onClick={() => setShowNewProductForm(!showNewProductForm)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
      >
        {showNewProductForm ? '취소' : '새 상품 추가'}
      </button>
      {showNewProductForm && (
        <ProductAddForm onSubmit={() => setShowNewProductForm(false)} />
      )}
      <div className="space-y-2">
        {products.map((product, index) => (
          <div
            key={product.id}
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
              <div className="mt-2">
                {editingProductId && editingProductId === product.id ? (
                  <Suspense fallback={<>loading</>}>
                    <ProductEditForm
                      editingProductId={editingProductId}
                      onSubmit={() => setEditingProductId(null)}
                    />
                  </Suspense>
                ) : (
                  <div>
                    {product.discounts.map((discount, index) => (
                      <div key={index} className="mb-2">
                        <span>
                          {discount.quantity}개 이상 구매 시{' '}
                          {discount.rate * 100}% 할인
                        </span>
                      </div>
                    ))}
                    <button
                      data-testid="modify-button"
                      onClick={() => handleEditProduct(product.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
                    >
                      수정
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
