import { Discount, Product } from '../../../types'
import { ProductCard } from './ProductCard'

interface ProductListProps {
  products: Product[]
  getRemainingStock: (product: Product) => number
  getMaxDiscount: (discounts: Discount[]) => number
  addToCart: (product: Product) => void
}

export const ProductList = ({
  products,
  getRemainingStock,
  getMaxDiscount,
  addToCart,
}: ProductListProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
      <div className="space-y-2">
        {products.map((product, index) => {
          const remainingStock = getRemainingStock(product)
          const discountPrice = (getMaxDiscount(product.discounts) * 100).toFixed(0)
          return (
            <ProductCard
              key={index}
              product={product}
              remainingStock={remainingStock}
              discountPrice={discountPrice}
              addToCart={addToCart}
            />
          )
        })}
      </div>
    </div>
  )
}
