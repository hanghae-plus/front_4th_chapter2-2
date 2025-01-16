import { CartItem, Coupon } from '../../../types'
import { ApplyCoupon } from './ApplyCoupon'
import { CartCard } from './CartCard'
import { OrderSummary } from './OrderSummary'

interface CalculateTotalResult {
  totalBeforeDiscount: number
  totalAfterDiscount: number
  totalDiscount: number
}

interface CartDetailsProps {
  cart: CartItem[]
  coupons: Coupon[]
  getAppliedDiscount: (item: CartItem) => number
  updateQuantity: (productId: string, newQuantity: number) => void
  removeFromCart: (productId: string) => void
  selectedCoupon: Coupon | null
  applyCoupon: (coupon: Coupon) => void
  calculateTotal: () => CalculateTotalResult
}

export const CartDetails = ({
  cart,
  coupons,
  getAppliedDiscount,
  updateQuantity,
  removeFromCart,
  selectedCoupon,
  applyCoupon,
  calculateTotal,
}: CartDetailsProps) => {
  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal()
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>

      <div className="space-y-2">
        {cart.map((item, index) => {
          const appliedDiscount = getAppliedDiscount(item)
          return (
            <CartCard
              key={index}
              item={item}
              appliedDiscount={appliedDiscount}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            ></CartCard>
          )
        })}
      </div>
      <ApplyCoupon
        coupons={coupons}
        selectedCoupon={selectedCoupon}
        applyCoupon={applyCoupon}
      />

      <OrderSummary
        totalDiscount={totalDiscount}
        totalBeforeDiscount={totalBeforeDiscount}
        totalAfterDiscount={totalAfterDiscount}
      />
    </div>
  )
}
