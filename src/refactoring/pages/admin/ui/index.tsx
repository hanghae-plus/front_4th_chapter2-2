import { useState } from 'react';
import { Coupon, Product } from '../../../../types';
import { TextButton } from '../../../shared/ui';
import { ProductPanel } from '../../../features/product/ui/ProductPanel';
import { useProductContext } from '../../../features/product/lib/context';
import { useCouponContext } from '../../../features/coupon/lib/context';

export function AdminPage() {
  const { products, updateProduct, addProduct } = useProductContext();
  const { coupons, addCoupon } = useCouponContext();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });

  // handleEditProduct 함수 수정
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };
  // 수정 완료 핸들러 함수 추가
  const handleEditComplete = () => {
    if (editingProduct) {
      addProduct(editingProduct);
      setEditingProduct(null);
    }
  };

  const handleAddCoupon = () => {
    addCoupon(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
    });
  };

  const handleAddNewProduct = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    addProduct(productWithId);
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    });
    setShowNewProductForm(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">상품 관리</h2>
          <TextButton
            variant="add"
            title={showNewProductForm ? '취소' : '새 상품 추가'}
            onClick={() => setShowNewProductForm(!showNewProductForm)}
          />
          {showNewProductForm && (
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
              <div className="mb-2">
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                  상품명
                </label>
                <input
                  id="productName"
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">
                  가격
                </label>
                <input
                  id="productPrice"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: parseInt(e.target.value, 10) })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="productStock" className="block text-sm font-medium text-gray-700">
                  재고
                </label>
                <input
                  id="productStock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, stock: parseInt(e.target.value, 10) })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <TextButton variant="add" title="추가" onClick={handleAddNewProduct} fullWidth />
            </div>
          )}
          <div className="space-y-2">
            {products.map((product, index) => {
              const key = `product-${index + 1}`;
              const isEditable = editingProduct && editingProduct.id === product.id;
              return (
                <ProductPanel
                  key={key}
                  testId={key}
                  product={product}
                  isEditing={isEditable ?? false}
                  onProductUpdate={updateProduct}
                  onEdit={handleEditProduct}
                  onEditComplete={handleEditComplete}
                />
              );
            })}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
          <div className="bg-white p-4 rounded shadow">
            <div className="space-y-2 mb-4">
              <input
                type="text"
                placeholder="쿠폰 이름"
                value={newCoupon.name}
                onChange={(e) => setNewCoupon({ ...newCoupon, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="쿠폰 코드"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <div className="flex gap-2">
                <select
                  value={newCoupon.discountType}
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      discountType: e.target.value as 'amount' | 'percentage',
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="amount">금액(원)</option>
                  <option value="percentage">할인율(%)</option>
                </select>
                <input
                  type="number"
                  placeholder="할인 값"
                  value={newCoupon.discountValue}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, discountValue: parseInt(e.target.value, 10) })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <TextButton
                variant="complete"
                title="쿠폰 추가"
                onClick={handleAddCoupon}
                fullWidth
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
              <div className="space-y-2">
                {coupons.map((coupon, index) => {
                  const key = `${index}-${coupon.name}`;
                  return (
                    <div
                      key={key}
                      data-testid={`coupon-${index + 1}`}
                      className="bg-gray-100 p-2 rounded"
                    >
                      {coupon.name} ({coupon.code}):
                      {coupon.discountType === 'amount'
                        ? `${coupon.discountValue}원`
                        : `${coupon.discountValue}%`}{' '}
                      할인
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        ; ; ;
      </div>
    </div>
  );
}
