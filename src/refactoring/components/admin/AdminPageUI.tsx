// adminPageUi.tsx
import { ProductType, CouponType, DiscountType } from '../../types';
import { InputField } from '../InputField';
import { CouponForm } from './CouponForm';
import { CouponList } from './CouponList';
import { ProductForm } from './ProductForm';
import { DiscountForm } from './DiscountForm';

interface Props {
  productList: ProductType[];
  couponList: CouponType[];
  openProductIds: Set<string>;
  editingProduct: ProductType | null;
  newDiscount: DiscountType;
  newCoupon: CouponType;
  setNewDiscount: React.Dispatch<React.SetStateAction<DiscountType>>;
  setNewCoupon: React.Dispatch<React.SetStateAction<CouponType>>;
  showNewProductForm: boolean;
  newProduct: Omit<ProductType, 'id'>;
  setNewProduct: React.Dispatch<React.SetStateAction<Omit<ProductType, 'id'>>>;
  setShowNewProductForm: (show: boolean) => void;
  handleProductNameUpdate: (productId: string, newName: string) => void;
  handlePriceUpdate: (productId: string, newPrice: number) => void;
  handleStockUpdate: (productId: string, newStock: number) => void;
  handleAddDiscount: (productId: string) => void;
  handleRemoveDiscount: (productId: string, index: number) => void;
  handleAddCoupon: () => void;
  handleAddNewProduct: () => void;
  toggleProductAccordion: (productId: string) => void;
  handleEditProduct: (product: ProductType) => void;
  handleEditComplete: () => void;
}

export const AdminPageUI = ({
  productList,
  couponList,
  openProductIds,
  editingProduct,
  newDiscount,
  newCoupon,
  showNewProductForm,
  newProduct,
  setNewProduct,
  setShowNewProductForm,
  handleProductNameUpdate,
  handlePriceUpdate,
  handleStockUpdate,
  handleAddDiscount,
  handleRemoveDiscount,
  handleAddCoupon,
  handleAddNewProduct,
  toggleProductAccordion,
  handleEditProduct,
  handleEditComplete,
  setNewDiscount,
  setNewCoupon,
}: Props) => (
  <div className='container mx-auto p-4'>
    <h1 className='text-3xl font-bold mb-6'>관리자 페이지</h1>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      <div>
        <h2 className='text-2xl font-semibold mb-4'>상품 관리</h2>
        <ProductForm
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          handleAddNewProduct={handleAddNewProduct}
          showNewProductForm={showNewProductForm}
          setShowNewProductForm={setShowNewProductForm}
        />

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
              {openProductIds.has(product.id) && (
                <div className='mt-2'>
                  {editingProduct && editingProduct.id === product.id ? (
                    <div>
                      <InputField
                        id='product-name'
                        label='상품명'
                        value={editingProduct.name}
                        type='text'
                        onChange={(e) => handleProductNameUpdate(product.id, e.target.value)}
                        className='mb-2'
                      />
                      <InputField
                        id='product-price'
                        label='가격'
                        value={editingProduct.price}
                        type='number'
                        onChange={(e) => handlePriceUpdate(product.id, parseInt(e.target.value))}
                        className='mb-2'
                      />
                      <InputField
                        id='product-stock'
                        label='재고'
                        value={editingProduct.stock}
                        type='number'
                        onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value))}
                        className='mb-2'
                      />

                      {editingProduct && editingProduct.id === product.id && (
                        <DiscountForm
                          productId={product.id}
                          discountList={editingProduct.discounts}
                          onAddDiscount={handleAddDiscount}
                          onRemoveDiscount={handleRemoveDiscount}
                          newDiscount={newDiscount}
                          setNewDiscount={setNewDiscount}
                        />
                      )}

                      <button
                        onClick={handleEditComplete}
                        className='bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2'
                      >
                        수정 완료
                      </button>
                    </div>
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
          <CouponForm
            newCoupon={newCoupon}
            setNewCoupon={setNewCoupon}
            onAddCoupon={handleAddCoupon}
          />
          <CouponList couponList={couponList} />
        </div>
      </div>
    </div>
  </div>
);
