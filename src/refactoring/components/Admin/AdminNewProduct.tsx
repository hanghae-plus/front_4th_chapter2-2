import ProductForm from '../Cart/ProductForm.tsx';
import useNewProduct from '../../hooks/useNewProduct.ts';
import { Product } from '../../../types.ts';

interface AdminNewProductProps {
  onProductAdd: (newProduct: Product) => void;
}

const AdminNewProduct = ({ onProductAdd }: AdminNewProductProps) => {
  const { showNewProductForm, toggleShowNewProductForm, ...newProductProps } = useNewProduct({
    onProductAdd,
  });
  return (
    <>
      <button
        onClick={toggleShowNewProductForm}
        className='bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600'
      >
        {showNewProductForm ? '취소' : '새 상품 추가'}
      </button>
      {showNewProductForm && <ProductForm {...newProductProps} />}
    </>
  );
};

export default AdminNewProduct;
