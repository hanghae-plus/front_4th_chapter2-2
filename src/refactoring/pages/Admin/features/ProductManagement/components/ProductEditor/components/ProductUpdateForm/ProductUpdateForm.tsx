import React, { useState } from 'react';

import { useProductForm } from '@/refactoring/pages/Admin/features/ProductManagement/components/ProductEditor/components/ProductUpdateForm/hooks/useProductForm';
import type { Discount, Product } from '@/types';

interface ProductUpdateFormProps {
  initProduct: Product;
  onProductUpdate: (updatedProduct: Product) => void;
  onEditComplete: () => void;
}

export const ProductUpdateForm = ({ initProduct, onProductUpdate, onEditComplete }: ProductUpdateFormProps) => {
  const { editingProduct, updateName, updatePrice, updateStock, updateDiscounts } = useProductForm({ initProduct });
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });

  const handleAddDiscount = () => {
    updateDiscounts([...editingProduct.discounts, newDiscount]);
    setNewDiscount({ quantity: 0, rate: 0 });
  };

  const handleRemoveDiscount = (index: number) => {
    updateDiscounts(editingProduct.discounts.filter((_, i) => i !== index));
  };

  const handleEditComplete = () => {
    onProductUpdate(editingProduct);
    onEditComplete();
  };

  return (
    <div>
      <div className="mb-4">
        <label className="mb-1 block">상품명: </label>
        <input
          type="text"
          value={editingProduct.name}
          onChange={e => updateName(e.target.value)}
          className="w-full rounded border p-2"
        />
      </div>
      <div className="mb-4">
        <label className="mb-1 block">가격: </label>
        <input
          type="number"
          value={editingProduct.price}
          onChange={e => updatePrice(parseInt(e.target.value))}
          className="w-full rounded border p-2"
        />
      </div>
      <div className="mb-4">
        <label className="mb-1 block">재고: </label>
        <input
          type="number"
          value={editingProduct.stock}
          onChange={e => updateStock(parseInt(e.target.value))}
          className="w-full rounded border p-2"
        />
      </div>
      {/* 할인 정보 수정 부분 */}
      <div>
        <h4 className="mb-2 text-lg font-semibold">할인 정보</h4>
        {editingProduct.discounts.map((discount, index) => (
          <div key={index} className="mb-2 flex items-center justify-between">
            <span>
              {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
            </span>
            <button
              onClick={() => handleRemoveDiscount(index)}
              className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
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
            onChange={e => setNewDiscount({ ...newDiscount, quantity: parseInt(e.target.value) })}
            className="w-1/3 rounded border p-2"
          />
          <input
            type="number"
            placeholder="할인율 (%)"
            value={newDiscount.rate * 100}
            onChange={e => setNewDiscount({ ...newDiscount, rate: parseInt(e.target.value) / 100 })}
            className="w-1/3 rounded border p-2"
          />
          <button onClick={handleAddDiscount} className="w-1/3 rounded bg-blue-500 p-2 text-white hover:bg-blue-600">
            할인 추가
          </button>
        </div>
      </div>

      <button
        onClick={handleEditComplete}
        className="mt-2 rounded bg-green-500 px-2 py-1 text-white hover:bg-green-600"
      >
        수정 완료
      </button>
    </div>
  );
};
