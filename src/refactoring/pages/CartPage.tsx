import { CartItem, Coupon, Product } from '../../types.ts'
import { useCart } from '../hooks/useCart.ts'
import { ApplyCoupon } from '../components/Cart/ApplyCoupon.tsx'
import { CartCard } from '../components/Cart/CartCard.tsx'
import { OrderSummary } from '../components/Cart/OrderSummary.tsx'
import { ProductCard } from '../components/Cart/ProductCard.tsx'
import { ProductList } from '../components/Cart/ProductList.tsx'
import { CartDetails } from '../components/Cart/CartDetails.tsx'

interface Props {
  products: Product[]
  coupons: Coupon[]
}

export const CartPage = ({ products, coupons }: Props) => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  } = useCart()

  const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
    return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0)
  }

  const getRemainingStock = (product: Product) => {
    const cartItem = cart.find((item) => item.product.id === product.id)
    return product.stock - (cartItem?.quantity || 0)
  }

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
        <ProductList
          products={products}
          getRemainingStock={getRemainingStock}
          getMaxDiscount={getMaxDiscount}
          addToCart={addToCart}
        />
        <CartDetails
          cart={cart}
          coupons={coupons}
          getAppliedDiscount={getAppliedDiscount}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          selectedCoupon={selectedCoupon}
          applyCoupon={applyCoupon}
          calculateTotal={calculateTotal}
        />
      </div>
    </div>
  )
}
