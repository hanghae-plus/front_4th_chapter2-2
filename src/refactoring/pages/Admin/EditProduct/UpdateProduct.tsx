import { useState } from 'react';

import type { Discount, Product } from '@/types';

interface UpdateProductProps {
  product: Product;
  testId: string;
  onProductUpdate: (updatedProduct: Product) => void;
}

export const UpdateProduct = ({ product, testId, onProductUpdate }: UpdateProductProps) => {
  const [openProductId, setOpenProductId] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });

  const toggleProductAccordion = () => {
    setOpenProductId(prev => !prev);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const handleProductNameUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct) return;

    const newName = e.target.value;
    const updatedProduct = { ...editingProduct, name: newName };
    setEditingProduct(updatedProduct);
  };

  const handlePriceUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct) return;

    const newPrice = parseInt(e.target.value);
    const updatedProduct = { ...editingProduct, price: newPrice };
    setEditingProduct(updatedProduct);
  };

  const handleEditComplete = () => {
    if (!editingProduct) return;

    onProductUpdate(editingProduct);
    setEditingProduct(null);
  };

  const handleStockUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct) return;

    const newStock = parseInt(e.target.value);
    const updatedProduct = { ...editingProduct, stock: newStock };
    setEditingProduct(updatedProduct);
  };

  const handleAddDiscount = () => {
    if (!editingProduct) return;

    const newProduct = {
      ...editingProduct,
      discounts: [...editingProduct.discounts, newDiscount]
    };
    setEditingProduct(newProduct);
    setNewDiscount({ quantity: 0, rate: 0 });
  };

  const handleRemoveDiscount = (index: number) => {
    if (!editingProduct) return;

    const newProduct = {
      ...editingProduct,
      discounts: editingProduct.discounts.filter((_, i) => i !== index)
    };
    setEditingProduct(newProduct);
  };

  return (
    <div key={product.id} data-testid={`product-${testId}`} className="rounded bg-white p-4 shadow">
      <button data-testid="toggle-button" onClick={toggleProductAccordion} className="w-full text-left font-semibold">
        {product.name} - {product.price}원 (재고: {product.stock})
      </button>

      {openProductId && (
        <div className="mt-2">
          {editingProduct ? (
            <div>
              <div className="mb-4">
                <label className="mb-1 block">상품명: </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={handleProductNameUpdate}
                  className="w-full rounded border p-2"
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block">가격: </label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={handlePriceUpdate}
                  className="w-full rounded border p-2"
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block">재고: </label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={handleStockUpdate}
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
                  <button
                    onClick={handleAddDiscount}
                    className="w-1/3 rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
                  >
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
                className="mt-2 rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
              >
                수정
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
