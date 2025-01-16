import { Product } from '../../../../../types';
import Input from '../../../atoms/Input';

export interface ProductAddInputProps {
  newProduct: Omit<Product, 'id'>;
  handleNewProduct: (product: Omit<Product, 'id'>) => void;
}

export const ProductAddInput = ({ newProduct, handleNewProduct }: ProductAddInputProps) => {
  return (
    <div>
      <div className="mb-2">
        <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
          상품명
        </label>

        <Input
          id="productName"
          value={newProduct.name}
          onChange={value => handleNewProduct({ ...newProduct, name: value.toString() })}
        />
      </div>
      <div className="mb-2">
        <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">
          가격
        </label>

        <Input
          id="productPrice"
          type="number"
          value={newProduct.price}
          onChange={value => {
            handleNewProduct({
              ...newProduct,
              price: typeof value === 'string' ? parseInt(value) : value
            });
          }}
        />
      </div>
      <div className="mb-2">
        <label htmlFor="productStock" className="block text-sm font-medium text-gray-700">
          재고
        </label>

        <Input
          id="productStock"
          type="number"
          value={newProduct.stock}
          onChange={value => {
            handleNewProduct({
              ...newProduct,
              stock: typeof value === 'string' ? parseInt(value) : value
            });
          }}
        />
      </div>
    </div>
  );
};
