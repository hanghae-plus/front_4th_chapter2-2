import { useCallback } from 'react'
import { CartItem, Product } from '@/types'
import { updateCartItemQuantity } from '../utils/cart'
import { useLocalStorage } from './useLocalStorage'

// 장바구니 아이템 관리
export const useCartItems = () => {
  const [cart, setCart] = useLocalStorage<CartItem[]>({ key: 'cart', initialValue: [] })

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

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
  }
}
