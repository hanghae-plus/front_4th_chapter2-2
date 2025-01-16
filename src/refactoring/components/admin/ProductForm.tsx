import { Product } from '../../../types';
import { Button } from '../common/Button';

interface ProductFormProps {
  showForm: boolean;
  onToggleForm: () => void;
  newProduct: Product;
  onProductChange: (product: Product) => void;
  onSubmit: () => void;
}

export const ProductForm = ({
  showForm,
  onToggleForm,
  newProduct,
  onProductChange,
  onSubmit,
}: ProductFormProps) => {
  return (
    <div className='mb-6'>
      <Button onClick={onToggleForm} className='bg-green-500 text-white px-4 py-2 rounded mb-4'>
        {showForm ? '취소' : '새 상품 추가'}
      </Button>

      {showForm && (
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
              onChange={(e) => onProductChange({ ...newProduct, name: e.target.value })}
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
              onChange={(e) =>
                onProductChange({
                  ...newProduct,
                  price: parseInt(e.target.value),
                })
              }
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
              onChange={(e) =>
                onProductChange({
                  ...newProduct,
                  stock: parseInt(e.target.value),
                })
              }
              className='w-full p-2 border rounded'
            />
          </div>
          <Button variant='primary' onClick={onSubmit} className='w-full'>
            추가
          </Button>
        </div>
      )}
    </div>
  );
};
