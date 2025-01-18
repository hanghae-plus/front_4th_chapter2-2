import { Cart, CartItem, Coupon, Product } from "../../types"

// 추상화의 의미
// How -> What
// 변하는 것과 변하지 않는 것을 구분하여 변하는 것을 캡슐화
// '상품별 최대 적용가능한 할인율'을 구하는 것은 정책에 따라 달라질 수 있음
// 그러나 '상품별 최대 적용가능한 할인율'이라는 개념은 변하지 않음

// 상품별 최대 적용가능한 할인율
export const getMaxApplicableDiscount = (item: CartItem) => {
  return item.product.discounts.reduce((maxDiscount, d) => {
    return item.quantity >= d.quantity && d.rate > maxDiscount ? d.rate : maxDiscount
  }, 0)
}

// 상품별 총 가격
export const calculateItemTotal = (item: CartItem) => {
  return item.product.price * item.quantity * (1 - getMaxApplicableDiscount(item))
}

// 장바구니 총 가격
export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  let totalBeforeDiscount = 0
  let totalAfterDiscount = 0

  cart.forEach((item) => {
    const { price } = item.product
    const { quantity } = item
    totalBeforeDiscount += price * quantity
    totalAfterDiscount += calculateItemTotal(item)
  })

  let totalDiscount = totalBeforeDiscount - totalAfterDiscount

  // 쿠폰 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === "amount") {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue)
    } else {
      totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100
    }
    totalDiscount = totalBeforeDiscount - totalAfterDiscount
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
  }
}

// 장바구니에 상품 추가
// - 상품이 이미 장바구니에 있는 경우 수량을 증가시키고, 없는 경우 새로 추가
// - 재고가 부족한 경우 추가하지 않음
// - 수량은 상품의 재고를 넘을 수 없음
// - 수량이 0 이하인 경우 상품을 장바구니에서 제거
export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock
        const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity))
        return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null
      }
      return item
    })
    .filter((item): item is CartItem => item !== null)
}

export const getAppliedDiscount = (item: CartItem) => {
  const { discounts } = item.product
  const { quantity } = item

  return Math.max(0, ...discounts.filter((discount) => quantity >= discount.quantity).map((discount) => discount.rate))
}

export const getRemainingStock = (cart: Cart, product: Product) => {
  const cartItem = cart.find((item) => item.product.id === product.id)
  return product.stock - (cartItem?.quantity || 0)
}
