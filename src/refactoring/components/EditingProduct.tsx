import { Product } from '../../types';
import { useProductDiscount } from '../hooks/useProductDiscount';
import { useProductEdit } from '../hooks/useProductEdit';
import ProductDiscount from './ProductDiscount';

interface Props {
  product: Product;
  productEdit: ReturnType<typeof useProductEdit> & {
    editingProduct: Product;
  };
  productDiscount: ReturnType<typeof useProductDiscount>;
}
export default function EditingProduct({ product, productEdit, productDiscount }: Props) {
  const { editingProduct, updateProductWith, completeEditing } = productEdit;

  return (
    <div>
      <div className='mb-4'>
        <label className='block mb-1'>상품명: </label>
        <input
          title='상품명'
          type='text'
          value={editingProduct.name}
          onChange={(e) => updateProductWith(product.id, 'name', e.target.value)}
          className='w-full p-2 border rounded'
        />
      </div>
      <div className='mb-4'>
        <label className='block mb-1'>가격: </label>
        <input
          title='가격'
          type='number'
          value={editingProduct.price}
          onChange={(e) => updateProductWith(product.id, 'price', parseInt(e.target.value))}
          className='w-full p-2 border rounded'
        />
      </div>
      <div className='mb-4'>
        <label className='block mb-1'>재고: </label>
        <input
          title='재고'
          type='number'
          value={editingProduct.stock}
          onChange={(e) => updateProductWith(product.id, 'stock', parseInt(e.target.value))}
          className='w-full p-2 border rounded'
        />
      </div>
      <ProductDiscount
        id={product.id}
        editingProduct={editingProduct}
        productDiscount={productDiscount}
      />
      <button
        onClick={completeEditing}
        className='bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2'
      >
        수정 완료
      </button>
    </div>
  );
}
