import { useState } from "react"
import { Product } from "../../types.ts"

export const useProducts = (initialProducts: Product[] = []) => {
  const [products, setProducts] = useState<Product[]>(initialProducts)

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) => prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
  }

  const addProduct = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct])
  }

  // NOTE: 이렇게 하면 모양은 이상해도 해당 훅을 사용하는 곳을 더 쉽게 찾아 갈 수 있습니다.
  return new (class {
    products = products
    updateProduct = updateProduct
    addProduct = addProduct
  })()
}
