import { useState } from 'react';

import { Collapsible } from '@/refactoring/pages/Admin/features/ProductManagement/ui/Collapsible';
import { InputFieldWithLabel } from '@/refactoring/pages/Admin/features/ProductManagement/ui/InputFieldWithLabel';
import type { Product } from '@/types';

interface ProductAddFormProps {
  onProductAdd: (product: Product) => void;
}

export const ProductAddForm = ({ onProductAdd }: ProductAddFormProps) => {
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
  };

  return (
    <Collapsible>
      <Collapsible.Toggle className="mb-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
        {isOpen => (isOpen ? '취소' : '새 상품 추가')}
      </Collapsible.Toggle>

      <Collapsible.Content>
        <div className="mb-4 rounded bg-white p-4 shadow">
          <h3 className="mb-2 text-xl font-semibold">새 상품 추가</h3>

          <div className="mb-2">
            <InputFieldWithLabel
              id="productName"
              type="text"
              value={newProduct.name}
              onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
            >
              상품명
            </InputFieldWithLabel>
          </div>

          <div className="mb-2">
            <InputFieldWithLabel
              id="productPrice"
              type="number"
              value={newProduct.price}
              onChange={e => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })}
            >
              가격
            </InputFieldWithLabel>
          </div>

          <div className="mb-2">
            <InputFieldWithLabel
              id="productStock"
              type="number"
              value={newProduct.stock}
              onChange={e => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
            >
              재고
            </InputFieldWithLabel>
          </div>

          <Collapsible.Toggle
            onClick={handleAddNewProduct}
            className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            추가
          </Collapsible.Toggle>
        </div>
      </Collapsible.Content>
    </Collapsible>
  );
};
