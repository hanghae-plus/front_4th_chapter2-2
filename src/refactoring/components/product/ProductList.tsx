import { useState } from 'react';
import { Discount, Product } from '../../../types';

import { useProductEditForm, useToggleSet } from '../../hooks';

interface ProductListProps {
  products: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
}

function ProductList({ products, onProductUpdate }: ProductListProps) {
  const { toggleItemAccordion, activeIds } = useToggleSet();
  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0
  });

  const { formState, resetForm, updateFormHandler, handleEditProduct } = useProductEditForm();

  const handleEditComplete = () => {
    if (formState) {
      onProductUpdate(formState);
      resetForm();
    }
  };

  const handleRemoveDiscount = (productId: string, index: number) => {
    const updatedProduct = products.find(p => p.id === productId);
    if (updatedProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: updatedProduct.discounts.filter((_, i) => i !== index)
      };
      onProductUpdate(newProduct);
      handleEditProduct(newProduct);
    }
  };

  const handleAddDiscount = (productId: string) => {
    const updatedProduct = products.find(p => p.id === productId);
    if (updatedProduct && formState) {
      const newProduct = {
        ...updatedProduct,
        discounts: [...updatedProduct.discounts, newDiscount]
      };
      onProductUpdate(newProduct);
      handleEditProduct(newProduct);
      setNewDiscount({ quantity: 0, rate: 0 });
    }
  };

  return (
    <div className="space-y-2">
      {products.map((product, index) => (
        <div key={product.id} data-testid={`product-${index + 1}`} className="bg-white p-4 rounded shadow">
          <button data-testid="toggle-button" onClick={() => toggleItemAccordion(product.id)} className="w-full text-left font-semibold">
            {product.name} - {product.price}원 (재고: {product.stock})
          </button>
          {activeIds.has(product.id) && (
            <div className="mt-2">
              {formState && formState?.id === product.id ? (
                <div>
                  <div className="mb-4">
                    <label className="block mb-1">상품명: </label>
                    <input
                      type="text"
                      value={formState.name}
                      onChange={e => updateFormHandler({ name: e.target.value }, product.id)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">가격: </label>
                    <input
                      type="number"
                      value={formState.price}
                      onChange={e => updateFormHandler({ price: parseInt(e.target.value) }, product.id)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">재고: </label>
                    <input
                      type="number"
                      value={formState.stock}
                      onChange={e => updateFormHandler({ stock: parseInt(e.target.value) }, product.id)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
                    {formState.discounts.map((discount, index) => (
                      <div key={index} className="flex justify-between items-center mb-2">
                        <span>
                          {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
                        </span>
                        <button
                          onClick={() => handleRemoveDiscount(product.id, index)}
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
                        onChange={e =>
                          setNewDiscount({
                            ...newDiscount,
                            quantity: parseInt(e.target.value)
                          })
                        }
                        className="w-1/3 p-2 border rounded"
                      />
                      <input
                        type="number"
                        placeholder="할인율 (%)"
                        value={newDiscount.rate * 100}
                        onChange={e =>
                          setNewDiscount({
                            ...newDiscount,
                            rate: parseInt(e.target.value) / 100
                          })
                        }
                        className="w-1/3 p-2 border rounded"
                      />
                      <button
                        onClick={() => handleAddDiscount(product.id)}
                        className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                      >
                        할인 추가
                      </button>
                    </div>
                  </div>
                  <button onClick={handleEditComplete} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2">
                    수정 완료
                  </button>
                </div>
              ) : (
                <div>
                  {product.discounts.map((discount, index) => (
                    <div key={index} className="mb-2">
                      <span>
                        {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
                      </span>
                    </div>
                  ))}
                  <button
                    data-testid="modify-button"
                    onClick={() => handleEditProduct(product)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
                  >
                    수정
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export { ProductList };
