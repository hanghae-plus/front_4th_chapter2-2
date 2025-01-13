import { useState, useCallback } from 'react'
import { CartItem, Product, Coupon } from '@/types'
import { calculateCartTotal, updateCartItemQuantity } from '../models/cart'

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)

  const addToCart = useCallback((product: Product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.product.id === product.id)

      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return updateCartItemQuantity(currentCart, product.id, existingItem.quantity + 1)
        }
        return currentCart
      }

      return [...currentCart, { product, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.product.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
    setCart((currentCart) => {
      if (newQuantity <= 0) {
        return currentCart.filter((item) => item.product.id !== productId)
      }
      return updateCartItemQuantity(currentCart, productId, newQuantity)
    })
  }, [])

  const applyCoupon = useCallback((coupon: Coupon | null) => {
    setSelectedCoupon(coupon)
  }, [])

  const calculateTotal = useCallback(() => {
    return calculateCartTotal(cart, selectedCoupon)
  }, [cart, selectedCoupon])

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    selectedCoupon,
    calculateTotal,
  }
}
