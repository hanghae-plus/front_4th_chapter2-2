import { useState } from 'react'
import { Product } from '../../types.ts'

export const useProducts = (initialProducts: Product[]) => {
  const [productList, setProductList] = useState<Product[]>(initialProducts)

  const updateProduct = (product: Product) => {
    setProductList((prev) => [
      ...prev.filter((prevProduct) => prevProduct.id !== product.id),
      product,
    ])
  }

  const addProduct = (product: Product) => {
    setProductList((prev) => [...prev, product])
  }

  return { products: productList, updateProduct, addProduct }
}
