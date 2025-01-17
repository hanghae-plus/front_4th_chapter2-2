import { useState } from 'react';
import { clsx } from 'clsx';
import { TextButton } from '../../../shared/ui';
import { FormInput } from '../../../shared/ui/FormInput';
import { Product } from '../../../../types';

interface ProductAddFormProps {
  onSubmit: (product: Product) => void;
  className?: string;
}

const initialProductState: Omit<Product, 'id'> = {
  name: '',
  price: 0,
  stock: 0,
  discounts: [],
};

export function ProductAddForm({ onSubmit, className = '' }: ProductAddFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>(initialProductState);

  const handleSubmit = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    onSubmit(productWithId);
    setNewProduct(initialProductState);
    setShowForm(false);
  };

  return (
    <div className={clsx('space-y-4', className)}>
      <TextButton
        variant="add"
        title={showForm ? '취소' : '새 상품 추가'}
        onClick={() => setShowForm(!showForm)}
      />
      {showForm && (
        <div className="bg-white p-4 rounded shadow space-y-4">
          <h3 className="text-xl font-semibold">새 상품 추가</h3>
          <FormInput
            id="productName"
            label="상품명"
            type="text"
            placeholder="상품1"
            value={newProduct.name}
            onChange={(value) => setNewProduct({ ...newProduct, name: value })}
          />
          <FormInput
            id="productPrice"
            label="가격"
            placeholder="10000"
            value={newProduct.price}
            onChange={(value) => setNewProduct({ ...newProduct, price: parseInt(value, 10) })}
          />
          <FormInput
            id="productStock"
            label="재고"
            placeholder="100"
            value={newProduct.stock}
            onChange={(value) => setNewProduct({ ...newProduct, stock: parseInt(value, 10) })}
          />
          <TextButton variant="add" title="추가" onClick={handleSubmit} fullWidth />
        </div>
      )}
    </div>
  );
}
