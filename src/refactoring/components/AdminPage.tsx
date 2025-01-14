import { Coupon, Product } from '../../types.ts';
import useAdmin from '../hooks/useAdmin.ts';
import useNewCoupon from '../hooks/useNewCoupon.ts';
import useProductSet from '../hooks/useProductSet.ts';
import useNewProduct from '../hooks/useNewProduct.ts';
import EditProductForm from './EditProductForm.tsx';
import ProductForm from './ProductForm.tsx';
import ManageCoupon from './ManageCoupon.tsx';

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const AdminPage = ({
  products,
  coupons,
  onProductUpdate,
  onProductAdd,
  onCouponAdd,
}: Props) => {
  const { handleEditProduct, editingProduct, ...adminProps } = useAdmin({
    products,
    onProductUpdate,
  });

  const newCouponProps = useNewCoupon({ onCouponAdd });

  const { openProductIds, toggleProductAccordion } = useProductSet();

  const { showNewProductForm, toggleShowNewProductForm, ...newProductProps } = useNewProduct({
    onProductAdd,
  });

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>관리자 페이지</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <h2 className='text-2xl font-semibold mb-4'>상품 관리</h2>
          <button
            onClick={toggleShowNewProductForm}
            className='bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600'
          >
            {showNewProductForm ? '취소' : '새 상품 추가'}
          </button>
          {showNewProductForm && <ProductForm {...newProductProps} />}
          <div className='space-y-2'>
            {products.map((product, index) => (
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
                {openProductIds.has(product.id) && (
                  <div className='mt-2'>
                    {editingProduct && editingProduct.id === product.id ? (
                      <EditProductForm
                        product={product}
                        editingProduct={editingProduct}
                        {...adminProps}
                      />
                    ) : (
                      <div>
                        {product.discounts.map((discount, index) => (
                          <div key={index} className='mb-2'>
                            <span>
                              {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
                            </span>
                          </div>
                        ))}
                        <button
                          data-testid='modify-button'
                          onClick={() => handleEditProduct(product)}
                          className='bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2'
                        >
                          수정
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <ManageCoupon coupons={coupons} {...newCouponProps} />
      </div>
    </div>
  );
};
