import { useState } from 'react'
import { Coupon, Product } from '@/types'
import { ProductForm, ProductList, CouponManagement } from '@/refactoring/components'

interface Props {
  products: Product[]
  coupons: Coupon[]
  onProductUpdate: (updatedProduct: Product) => void
  onProductAdd: (newProduct: Product) => void
  onCouponAdd: (newCoupon: Coupon) => void
}

export const AdminPage = ({ products, coupons, onProductUpdate, onProductAdd, onCouponAdd }: Props) => {
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set())
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showNewProductForm, setShowNewProductForm] = useState(false)

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  // 이 핸들러들을 다시 추가
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product })
  }

  const handleEditComplete = (updatedProduct: Product) => {
    onProductUpdate(updatedProduct)
    setEditingProduct(null)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 상품 관리 섹션 */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
          <button
            onClick={() => setShowNewProductForm(!showNewProductForm)}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
          >
            {showNewProductForm ? '취소' : '새 상품 추가'}
          </button>

          {/* 새 상품 추가 폼 */}
          {showNewProductForm && (
            <ProductForm
              onSubmit={(product) => {
                const productWithId = { ...product, id: Date.now().toString() }
                onProductAdd(productWithId)
                setShowNewProductForm(false)
              }}
              onCancel={() => setShowNewProductForm(false)}
              submitLabel="추가"
            />
          )}

          {/* 상품 목록 */}
          <ProductList
            products={products}
            openProductIds={openProductIds}
            editingProduct={editingProduct}
            onToggleAccordion={toggleProductAccordion}
            onEditStart={handleEditProduct}
            onEditComplete={handleEditComplete}
            onEditCancel={() => setEditingProduct(null)}
          />
        </div>

        {/* 쿠폰 관리 섹션 */}
        <CouponManagement coupons={coupons} onCouponAdd={onCouponAdd} />
      </div>
    </div>
  )
}
