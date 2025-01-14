import { Coupon, Product } from '../../types.ts';
import useAdmin from '../hooks/useAdmin.ts';
import useNewCoupon from '../hooks/useNewCoupon.ts';
import useProductSet from '../hooks/useProductSet.ts';
import useNewProduct from '../hooks/useNewProduct.ts';
import EditProductForm from './EditProductForm.tsx';
import ProductForm from './ProductForm.tsx';

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

  const {
    newCoupon,
    handleAddCoupon,
    handleChangeName,
    handleChangeCode,
    handleChangeDiscountType,
    handleChangeDiscountValue,
  } = useNewCoupon({ onCouponAdd });

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
        <div>
          <h2 className='text-2xl font-semibold mb-4'>쿠폰 관리</h2>
          <div className='bg-white p-4 rounded shadow'>
            <div className='space-y-2 mb-4'>
              <input
                type='text'
                placeholder='쿠폰 이름'
                value={newCoupon.name}
                onChange={handleChangeName}
                className='w-full p-2 border rounded'
              />
              <input
                type='text'
                placeholder='쿠폰 코드'
                value={newCoupon.code}
                onChange={handleChangeCode}
                className='w-full p-2 border rounded'
              />
              <div className='flex gap-2'>
                <select
                  value={newCoupon.discountType}
                  onChange={handleChangeDiscountType}
                  className='w-full p-2 border rounded'
                >
                  <option value='amount'>금액(원)</option>
                  <option value='percentage'>할인율(%)</option>
                </select>
                <input
                  type='number'
                  placeholder='할인 값'
                  value={newCoupon.discountValue}
                  onChange={handleChangeDiscountValue}
                  className='w-full p-2 border rounded'
                />
              </div>
              <button
                onClick={handleAddCoupon}
                className='w-full bg-green-500 text-white p-2 rounded hover:bg-green-600'
              >
                쿠폰 추가
              </button>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-2'>현재 쿠폰 목록</h3>
              <div className='space-y-2'>
                {coupons.map((coupon, index) => (
                  <div
                    key={index}
                    data-testid={`coupon-${index + 1}`}
                    className='bg-gray-100 p-2 rounded'
                  >
                    {coupon.name} ({coupon.code}):
                    {coupon.discountType === 'amount'
                      ? `${coupon.discountValue}원`
                      : `${coupon.discountValue}%`}{' '}
                    할인
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
