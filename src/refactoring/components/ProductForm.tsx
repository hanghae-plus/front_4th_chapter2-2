import { Product } from '../../types.ts';
import { ChangeEvent } from 'react';

interface ProductFormProps {
  newProduct: Omit<Product, 'id'>;
  handleChangeProductName: (event: ChangeEvent<HTMLInputElement>) => void;
  handleChangeProductPrice: (event: ChangeEvent<HTMLInputElement>) => void;
  handleChangeProductStock: (event: ChangeEvent<HTMLInputElement>) => void;
  handleAddNewProduct: () => void;
}

const ProductForm = ({
  newProduct,
  handleAddNewProduct,
  handleChangeProductStock,
  handleChangeProductPrice,
  handleChangeProductName,
}: ProductFormProps) => (
  <div className='bg-white p-4 rounded shadow mb-4'>
    <h3 className='text-xl font-semibold mb-2'>새 상품 추가</h3>
    <div className='mb-2'>
      <label htmlFor='productName' className='block text-sm font-medium text-gray-700'>
        상품명
      </label>
      <input
        id='productName'
        type='text'
        value={newProduct.name}
        onChange={handleChangeProductName}
        className='w-full p-2 border rounded'
      />
    </div>
    <div className='mb-2'>
      <label htmlFor='productPrice' className='block text-sm font-medium text-gray-700'>
        가격
      </label>
      <input
        id='productPrice'
        type='number'
        value={newProduct.price}
        onChange={handleChangeProductPrice}
        className='w-full p-2 border rounded'
      />
    </div>
    <div className='mb-2'>
      <label htmlFor='productStock' className='block text-sm font-medium text-gray-700'>
        재고
      </label>
      <input
        id='productStock'
        type='number'
        value={newProduct.stock}
        onChange={handleChangeProductStock}
        className='w-full p-2 border rounded'
      />
    </div>
    <button
      onClick={handleAddNewProduct}
      className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
    >
      추가
    </button>
  </div>
);

export default ProductForm;
