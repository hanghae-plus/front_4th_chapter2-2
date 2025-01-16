import { useLocalStorage } from './useLocalStorage'
import { Product } from '@/types'

// 상품 목록 관리
export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useLocalStorage<Product[]>({
    key: 'products',
    initialValue: initialProducts,
  })

  const updateProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((product) =>
        // id 같은 상품만 업데이트
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    )
  }

  const addProduct = (newProduct: Product) => {
    setProducts([...products, newProduct])
  }

  return { products, updateProduct, addProduct }
}
