import { useState } from 'react';

import type { Product } from '@/types';

interface AddProductProps {
  onProductAdd: (product: Product) => void;
}

export const AddProduct = ({ onProductAdd }: AddProductProps) => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: []
  });

  const handleAddNewProduct = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    onProductAdd(productWithId);

    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: []
    });

    setShowNewProductForm(false);
  };

  return (
    <div>
      <button
        onClick={() => setShowNewProductForm(!showNewProductForm)}
        className="mb-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
      >
        {showNewProductForm ? '취소' : '새 상품 추가'}
      </button>

      {showNewProductForm && (
        <div className="mb-4 rounded bg-white p-4 shadow">
          <h3 className="mb-2 text-xl font-semibold">새 상품 추가</h3>

          <div className="mb-2">
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
              상품명
            </label>
            <input
              id="productName"
              type="text"
              value={newProduct.name}
              onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full rounded border p-2"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">
              가격
            </label>
            <input
              id="productPrice"
              type="number"
              value={newProduct.price}
              onChange={e => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })}
              className="w-full rounded border p-2"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="productStock" className="block text-sm font-medium text-gray-700">
              재고
            </label>
            <input
              id="productStock"
              type="number"
              value={newProduct.stock}
              onChange={e => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
              className="w-full rounded border p-2"
            />
          </div>

          <button onClick={handleAddNewProduct} className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600">
            추가
          </button>
        </div>
      )}
    </div>
  );
};
