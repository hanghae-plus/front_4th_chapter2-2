import AdminProductContent from './AdminProductContent.tsx';
import { Product } from '../../types.ts';
import useProductSet from '../hooks/useProductSet.ts';
import useAdmin from '../hooks/useAdmin.ts';

interface AdminProductCardProps {
  productList: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
}

const AdminProductList = ({ productList, onProductUpdate }: AdminProductCardProps) => {
  const adminProps = useAdmin({
    productList,
    onProductUpdate,
  });
  const { openProductIdList, toggleProductAccordion } = useProductSet();
  return (
    <div className='space-y-2'>
      {productList.map((product, index) => (
        <div
          key={product.id}
          data-testid={`product-${index + 1}`}
          className='bg-white p-4 rounded shadow'
        >
          <button
            data-testid='toggle-button'
            onClick={() => toggleProductAccordion(product.id)}
            className='w-full text-left font-semibold'
          >
            {product.name} - {product.price}원 (재고: {product.stock})
          </button>
          {openProductIdList.has(product.id) && (
            <AdminProductContent product={product} {...adminProps} />
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminProductList;
