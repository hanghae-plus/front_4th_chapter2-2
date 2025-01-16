import { useState } from 'react';
import { UpdateProduct } from '@advanced/entities/product';
import { Heading } from '@advanced/shared/ui';
import { useAddProductMutation } from '../model';

interface ProductAddFormProps {
  onSubmit: () => void;
}

export function ProductAddForm({ onSubmit }: ProductAddFormProps) {
  const { mutate: addProduct } = useAddProductMutation();

  const [newProduct, setNewProduct] = useState<UpdateProduct>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });

  const handleChangeNewProduct = (
    key: keyof UpdateProduct,
    value: UpdateProduct[keyof UpdateProduct],
  ) => {
    setNewProduct((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addProduct(newProduct);
    onSubmit();
  };

  return (
    <form className="bg-white p-4 rounded shadow mb-4" onSubmit={handleSubmit}>
      <Heading as="h3" className="text-xl font-semibold mb-2">
        새 상품 추가
      </Heading>
      <div className="mb-2">
        <label
          htmlFor="productName"
          className="block text-sm font-medium text-gray-700"
        >
          상품명
        </label>
        <input
          id="productName"
          name="productName"
          type="text"
          value={newProduct.name}
          onChange={(e) => handleChangeNewProduct('name', e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label
          htmlFor="productPrice"
          className="block text-sm font-medium text-gray-700"
        >
          가격
        </label>
        <input
          id="productPrice"
          name="productPrice"
          type="number"
          value={newProduct.price}
          onChange={(e) =>
            handleChangeNewProduct('price', parseInt(e.target.value))
          }
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label
          htmlFor="productStock"
          className="block text-sm font-medium text-gray-700"
        >
          재고
        </label>
        <input
          id="productStock"
          name="productStock"
          type="number"
          value={newProduct.stock}
          onChange={(e) =>
            handleChangeNewProduct('stock', parseInt(e.target.value))
          }
          className="w-full p-2 border rounded"
        />
      </div>
      <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        추가
      </button>
    </form>
  );
}
