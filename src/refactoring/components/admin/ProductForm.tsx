import { ProductType } from '../../types';
import { InputField } from '../InputField';

interface ProductFormProps {
  newProduct: Omit<ProductType, 'id'>;
  setNewProduct: React.Dispatch<React.SetStateAction<Omit<ProductType, 'id'>>>;
  handleAddNewProduct: () => void;
  showNewProductForm: boolean;
  setShowNewProductForm: (show: boolean) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  newProduct,
  setNewProduct,
  handleAddNewProduct,
  showNewProductForm,
  setShowNewProductForm,
}) => {
  const handleChange =
    (field: keyof Omit<ProductType, 'id'>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        [field]: value,
      }));
    };

  return (
    <div>
      <button
        onClick={() => setShowNewProductForm(!showNewProductForm)}
        className='bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600'
      >
        {showNewProductForm ? '취소' : '새 상품 추가'}
      </button>
      {showNewProductForm && (
        <div className='bg-white p-4 rounded shadow mb-4'>
          <h3 className='text-xl font-semibold mb-2'>새 상품 추가</h3>
          <InputField
            id='productName'
            label='상품명'
            value={newProduct.name}
            type='text'
            onChange={handleChange('name')}
            className='w-full p-2 border rounded mb-2'
          />
          <InputField
            id='productPrice'
            label='가격'
            value={newProduct.price}
            type='number'
            onChange={handleChange('price')}
            className='w-full p-2 border rounded mb-2'
          />
          <InputField
            id='productStock'
            label='재고'
            value={newProduct.stock}
            type='number'
            onChange={handleChange('stock')}
            className='w-full p-2 border rounded mb-2'
          />
          <button
            onClick={handleAddNewProduct}
            className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
          >
            추가
          </button>
        </div>
      )}
    </div>
  );
};
