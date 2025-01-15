import { useState } from 'react';
import { CouponType, DiscountType, ProductType } from '../types';
import { ProductForm } from './admin/ProductForm';
import { InputField } from './InputField';
import { CouponForm } from './admin/CouponForm';
import { CouponList } from './admin/CouponList';
import { DiscountForm } from './admin/DiscountForm';

interface Props {
  productList: ProductType[];
  couponList: CouponType[];
  onProductUpdate: (updatedProduct: ProductType) => void;
  onProductAdd: (newProduct: ProductType) => void;
  onCouponAdd: (newCoupon: CouponType) => void;
}

export const AdminPage = ({
  productList,
  couponList,
  onProductUpdate,
  onProductAdd,
  onCouponAdd,
}: Props) => {
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
  const [newDiscount, setNewDiscount] = useState<DiscountType>({ quantity: 0, rate: 0 });
  const [newCoupon, setNewCoupon] = useState<CouponType>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<ProductType, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  // handleEditProduct 함수 수정
  const handleEditProduct = (product: ProductType) => {
    setEditingProduct({ ...product });
  };

  const handleProductNameUpdate = (productId: string, newName: string) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, name: newName };
      setEditingProduct(updatedProduct);
    }
  };

  const handlePriceUpdate = (productId: string, newPrice: number) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, price: newPrice };
      setEditingProduct(updatedProduct);
    }
  };

  const handleEditComplete = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      setEditingProduct(null);
    }
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    const updatedProduct = productList.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = { ...updatedProduct, stock: newStock };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  };

  const handleAddDiscount = (productId: string) => {
    const updatedProduct = productList.find((p) => p.id === productId);
    if (updatedProduct && editingProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: [...updatedProduct.discounts, newDiscount],
      };

      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
      setNewDiscount({ quantity: 0, rate: 0 });
    }
  };

  const handleRemoveDiscount = (productId: string, index: number) => {
    const updatedProduct = productList.find((p) => p.id === productId);

    if (updatedProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: updatedProduct.discounts.filter((_, i) => i !== index),
      };

      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  };

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
    });
  };

  const handleAddNewProduct = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() };

    onProductAdd(productWithId);
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    });

    setShowNewProductForm(false);
  };

  return (
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
                        />
                        <InputField
                          id='product-price'
                          label='가격'
                          value={editingProduct.price}
                          type='number'
                          onChange={(e) => handlePriceUpdate(product.id, parseInt(e.target.value))}
                        />
                        <InputField
                          id='product-stock'
                          label='재고'
                          value={editingProduct.stock}
                          type='number'
                          onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value))}
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
};
