import { useState } from 'react';

import { ProductForm } from './ProductForm';
import { Product } from '../../../types';

interface ProductFormManageProps {
  onProductAdd: (newProduct: Product) => void;
}

function ProductFormManage({ onProductAdd }: ProductFormManageProps) {
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const registerProductForm = (newProduct: Product) => {
    onProductAdd({ ...newProduct, id: Date.now().toString() });
    setShowNewProductForm(false);
  };

  return (
    <>
      <button
        onClick={() => setShowNewProductForm(!showNewProductForm)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
      >
        {showNewProductForm ? '취소' : '새 상품 추가'}
      </button>
      {showNewProductForm && <ProductForm onRegisterProductForm={registerProductForm} />}
    </>
  );
}

export { ProductFormManage };
