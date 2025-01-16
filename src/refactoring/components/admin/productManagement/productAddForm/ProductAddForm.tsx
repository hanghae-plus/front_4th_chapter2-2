import { useProducts } from '../../../../hooks';
import { useForm } from '../../../../hooks/useForm';
import { ProductAddButton } from './ProductAddButton';
import { ProductAddInput } from './ProductAddInput';
import Title from '../../../atoms/Title';

export const ProductAddForm = () => {
  const { isNewProductForm } = useProducts();
  const { newProduct, handleNewProduct, handleAddNewProduct } = useForm();
  return (
    <div>
      {isNewProductForm && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <Title level={3} text="새 상품 추가" />
          <ProductAddInput newProduct={newProduct} handleNewProduct={handleNewProduct} />
          <ProductAddButton onClick={handleAddNewProduct} />
        </div>
      )}
    </div>
  );
};
