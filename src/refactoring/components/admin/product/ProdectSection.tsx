import { useState } from 'react';
import { Product } from '../../../../types';
import ProductList from './ProductList';
import NewProductForm from './NewProductForm';

interface ProductSectionProps {
  products: Product[];
  onProductAdd: (newProduct: Product) => void;
  onProductUpdate: (updatedProduct: Product) => void;
}

const ProductSection = ({ products, onProductAdd, onProductUpdate }: ProductSectionProps) => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
      <button
        onClick={() => setShowNewProductForm(!showNewProductForm)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
      >
        {showNewProductForm ? '취소' : '새 상품 추가'}
      </button>
      {showNewProductForm && (
        <NewProductForm onProductAdd={onProductAdd} setShowNewProductForm={setShowNewProductForm} />
      )}
      <div className="space-y-2">
        <ProductList products={products} onProductUpdate={onProductUpdate} />
      </div>
    </div>
  );
};
export default ProductSection;
