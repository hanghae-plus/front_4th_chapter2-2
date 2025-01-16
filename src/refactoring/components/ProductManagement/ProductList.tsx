import { Product } from '@/types'
import { ProductForm } from './ProductForm'

interface ProductListProps {
  products: Product[]
  openProductIds: Set<string>
  editingProduct: Product | null
  onToggleAccordion: (productId: string) => void
  onEditStart: (product: Product) => void // handleEditProduct
  onEditComplete: (updatedProduct: Product) => void // handleEditComplete
  onEditCancel: () => void
}

// 상품 목록 컴포넌트
export const ProductList = ({
  products,
  openProductIds,
  editingProduct,
  onToggleAccordion,
  onEditStart,
  onEditComplete,
  onEditCancel,
}: ProductListProps) => {
  return (
    <div className="space-y-2">
      {products.map((product, index) => (
        <div key={product.id} data-testid={`product-${index + 1}`} className="bg-white p-4 rounded shadow">
          {/* 상품 아코디언 헤더 */}
          <button
            data-testid="toggle-button"
            onClick={() => onToggleAccordion(product.id)}
            className="w-full text-left font-semibold"
          >
            {product.name} - {product.price}원 (재고: {product.stock})
          </button>

          {/* 상품 상세 정보 및 수정 폼 */}
          {openProductIds.has(product.id) && (
            <div className="mt-2">
              {editingProduct && editingProduct.id === product.id ? (
                <ProductForm
                  initialProduct={editingProduct}
                  onSubmit={(updatedProduct) => onEditComplete({ ...updatedProduct, id: product.id })}
                  onCancel={onEditCancel}
                  submitLabel="수정 완료"
                />
              ) : (
                <div>
                  {/* 할인 정보 표시 */}
                  {product.discounts.map((discount, index) => (
                    <div key={index} className="mb-2">
                      <span>
                        {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
                      </span>
                    </div>
                  ))}
                  {/* 수정 버튼 */}
                  <button
                    data-testid="modify-button"
                    onClick={() => onEditStart(product)}
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
  )
}
