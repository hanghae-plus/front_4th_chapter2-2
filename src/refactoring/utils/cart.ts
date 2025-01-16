import { CartItem, Coupon, Product } from '@/types'
// 유틸 함수는 전부 순수 함수로 구현

/**
 * 장바구니 개별 상품의 총액을 계산하는 함수
 */
export const calculateItemTotal = (item: CartItem): number => {
  const { product, quantity } = item
  const baseTotal = product.price * quantity
  const discount = getMaxApplicableDiscount(item)
  return baseTotal * (1 - discount)
}

/**
 * 적용 가능한 최대 할인율을 반환하는 함수
 */
export const getMaxApplicableDiscount = (item: CartItem): number => {
  const { product, quantity } = item
  let maxDiscount = 0

  product.discounts.forEach((discount) => {
    if (quantity >= discount.quantity && discount.rate > maxDiscount) {
      maxDiscount = discount.rate
    }
  })

  return maxDiscount
}

/**
 * 장바구니 전체 금액을 계산
 */
export const calculateCartTotal = (cart: CartItem[], coupon: Coupon | null) => {
  // 각 아이템별 할인 적용 전 총액
  const totalBeforeDiscount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  // 각 아이템별 할인 적용 후 총액
  const totalAfterItemDiscounts = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0)

  // 아이템 할인 금액
  const itemDiscounts = totalBeforeDiscount - totalAfterItemDiscounts

  let couponDiscount = 0
  if (coupon) {
    if (coupon.discountType === 'amount') {
      couponDiscount = coupon.discountValue
    } else {
      couponDiscount = totalAfterItemDiscounts * (coupon.discountValue / 100)
    }
  }

  const totalDiscount = itemDiscounts + couponDiscount
  const totalAfterDiscount = totalBeforeDiscount - totalDiscount

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  }
}

/**
 * 장바구니 상품 수량을 업데이트
 */
export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  if (newQuantity <= 0) {
    return cart.filter((item) => item.product.id !== productId)
  }

  return cart.map((item) => {
    if (item.product.id === productId) {
      const maxQuantity = item.product.stock
      return {
        ...item,
        quantity: Math.min(newQuantity, maxQuantity),
      }
    }
    return item
  })
}

/**
 * 상품의 할인 정책 중 최대 할인율을 계산하는 함수
 */
export const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0)
}

/**
 * 상품의 남은 재고를 계산하는 함수
 */
export const getRemainingStock = (product: Product, cart: CartItem[]) => {
  const cartItem = cart.find((item) => item.product.id === product.id)
  return product.stock - (cartItem?.quantity || 0)
}

/**
 * 장바구니 아이템에 적용된 할인율을 계산하는 함수
 */
export const getAppliedDiscount = (item: CartItem) => {
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
