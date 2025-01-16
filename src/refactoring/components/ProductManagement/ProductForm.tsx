import { useState } from 'react'
import { Product, Discount } from '@/types'

interface ProductFormProps {
  initialProduct?: Partial<Product>
  onSubmit: (product: Omit<Product, 'id'>) => void
  onCancel?: () => void
  submitLabel?: string
}

// 상품 생성/수정 폼
export const ProductForm = ({ initialProduct, onSubmit, onCancel, submitLabel = '저장' }: ProductFormProps) => {
  const [product, setProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
    ...initialProduct,
  })

  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0,
  })

  const handleAddDiscount = () => {
    if (newDiscount.quantity > 0 && newDiscount.rate > 0) {
      setProduct((prev) => ({
        ...prev,
        discounts: [...prev.discounts, newDiscount],
      }))
      setNewDiscount({ quantity: 0, rate: 0 })
    }
  }

  const handleRemoveDiscount = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      discounts: prev.discounts.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="mb-2">
        <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
          상품명
        </label>
        <input
          id="productName"
          type="text"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-2">
        <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">
          가격
        </label>
        <input
          id="productPrice"
          type="number"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: parseInt(e.target.value) || 0 })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-2">
        <label htmlFor="productStock" className="block text-sm font-medium text-gray-700">
          재고
        </label>
        <input
          id="productStock"
          type="number"
          value={product.stock}
          onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) || 0 })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
        {product.discounts.map((discount, index) => (
          <div key={index} className="flex justify-between items-center mb-2">
            <span>
              {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
            </span>
            <button
              onClick={() => handleRemoveDiscount(index)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              삭제
            </button>
          </div>
        ))}
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="수량"
            value={newDiscount.quantity}
            onChange={(e) =>
              setNewDiscount({
                ...newDiscount,
                quantity: parseInt(e.target.value) || 0,
              })
            }
            className="w-1/3 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="할인율 (%)"
            value={newDiscount.rate * 100}
            onChange={(e) =>
              setNewDiscount({
                ...newDiscount,
                rate: (parseInt(e.target.value) || 0) / 100,
              })
            }
            className="w-1/3 p-2 border rounded"
          />
          <button onClick={handleAddDiscount} className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            할인 추가
          </button>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onSubmit(product)}
          className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button onClick={onCancel} className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
            취소
          </button>
        )}
      </div>
    </div>
  )
}
