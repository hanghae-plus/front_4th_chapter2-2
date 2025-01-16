import { useProducts } from '../../../hooks';
import { useForm } from '../../../hooks/useForm';
import { ProductAddForm } from './productAddForm/ProductAddForm';
import { ProductList } from './productList/ProductList';

export const ProductManagement = () => {
  const { isNewProductForm } = useProducts();
  const { toggleNewProductForm } = useForm();
  return (
    <div>
      <button
        onClick={toggleNewProductForm}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
      >
        {isNewProductForm ? '취소' : '새 상품 추가'}
      </button>
      <ProductAddForm />
      <ProductList />
    </div>
  );
};
