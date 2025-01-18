import { useState } from 'react';
import { UpdateProduct } from '@advanced/entities/product';
import { Heading, Input } from '@advanced/shared/ui';
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
      <Input
        label="상품명"
        id="productName"
        type="text"
        value={newProduct.name}
        onChange={(e) => handleChangeNewProduct('name', e.target.value)}
      />
      <Input
        label="가격"
        id="productPrice"
        type="number"
        value={newProduct.price}
        onChange={(e) =>
          handleChangeNewProduct('price', parseInt(e.target.value))
        }
      />
      <Input
        label="재고"
        id="productStock"
        type="number"
        value={newProduct.stock}
        onChange={(e) =>
          handleChangeNewProduct('stock', parseInt(e.target.value))
        }
      />
      <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        추가
      </button>
    </form>
  );
}
