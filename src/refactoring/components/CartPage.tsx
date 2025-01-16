import { CartItem, Coupon, Product } from '../../types.ts'
import { useCart } from '../hooks/useCart.ts'
import { ApplyCoupon } from './ApplyCoupon.tsx'
import { CartCard } from './CartCard.tsx'
import { OrderSummary } from './OrderSummary.tsx'
import { ProductCard } from './ProductCard.tsx'

interface Props {
  products: Product[]
  coupons: Coupon[]
}

export const CartPage = ({ products, coupons }: Props) => {
  const { cart, addToCart, removeFromCart, updateQuantity, calculateTotal } = useCart()

  const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
    return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0)
  }

  const getRemainingStock = (product: Product) => {
    const cartItem = cart.find((item) => item.product.id === product.id)
    return product.stock - (cartItem?.quantity || 0)
  }

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal()

  const getAppliedDiscount = (item: CartItem) => {
    const { discounts } = item.product
    const { quantity } = item
    let appliedDiscount = 0
    for (const discount of discounts) {
      if (quantity >= discount.quantity) {
        appliedDiscount = Math.max(appliedDiscount, discount.rate)
      }
    }
    return appliedDiscount
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
          <div className="space-y-2">
            {products.map((product) => {
              const remainingStock = getRemainingStock(product)
              const discountPrice = (getMaxDiscount(product.discounts) * 100).toFixed(0)
              return (
                <ProductCard
                  product={product}
                  remainingStock={remainingStock}
                  discountPrice={discountPrice}
                  addToCart={addToCart}
                />
              )
            })}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>

          <div className="space-y-2">
            {cart.map((item) => {
              const appliedDiscount = getAppliedDiscount(item)
              return (
                <CartCard
                  item={item}
                  appliedDiscount={appliedDiscount}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                ></CartCard>
              )
            })}
          </div>
          <ApplyCoupon coupons={coupons} />

          <OrderSummary
            totalDiscount={totalDiscount}
            totalBeforeDiscount={totalBeforeDiscount}
            totalAfterDiscount={totalAfterDiscount}
          />
        </div>
      </div>
    </div>
  )
}
