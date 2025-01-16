import { Product } from '@types';
import { Heading } from '../shared/Heading';

interface ProductFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  newProduct: Omit<Product, 'id'>;
  setNewProduct: React.Dispatch<React.SetStateAction<Omit<Product, 'id'>>>;
}

export function ProductForm({
  newProduct,
  setNewProduct,
  onSubmit,
}: ProductFormProps) {
  return (
    <form className="bg-white p-4 rounded shadow mb-4" onSubmit={onSubmit}>
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
          type="text"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
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
          type="number"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              price: parseInt(e.target.value),
            })
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
          type="number"
          value={newProduct.stock}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              stock: parseInt(e.target.value),
            })
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
