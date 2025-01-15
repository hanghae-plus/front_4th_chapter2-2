import { useState } from 'react';
import { Coupon, Discount, Product } from '../../../../types';
import { TextButton } from '../../../shared/ui';

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}

export function AdminPage({
  products,
  coupons,
  onProductUpdate,
  onProductAdd,
  onCouponAdd,
}: Props) {
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });
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
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  // 새로운 핸들러 함수 추가
  const handleProductNameUpdate = (productId: string, newName: string) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, name: newName };
      setEditingProduct(updatedProduct);
    }
  };

  // 새로운 핸들러 함수 추가
  const handlePriceUpdate = (productId: string, newPrice: number) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, price: newPrice };
      setEditingProduct(updatedProduct);
    }
  };

  // 수정 완료 핸들러 함수 추가
  const handleEditComplete = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      setEditingProduct(null);
    }
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const newUpdatedProduct = { ...updatedProduct, stock: newStock };
      onProductUpdate(newUpdatedProduct);
      setEditingProduct(newUpdatedProduct);
    }
  };

  const handleAddDiscount = (productId: string) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct && editingProduct) {
      const newUpdatedProduct = {
        ...updatedProduct,
        discounts: [...updatedProduct.discounts, newDiscount],
      };
      onProductUpdate(newUpdatedProduct);
      setEditingProduct(newUpdatedProduct);
      setNewDiscount({ quantity: 0, rate: 0 });
    }
  };

  const handleRemoveDiscount = (productId: string, productIndex: number) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const newUpdatedProduct = {
        ...updatedProduct,
        discounts: updatedProduct.discounts.filter((_, i) => i !== productIndex),
      };
      onProductUpdate(newUpdatedProduct);
      setEditingProduct(newUpdatedProduct);
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
            {products.map((product, productIndex) => (
              <div
                key={product.id}
                data-testid={`product-${productIndex + 1}`}
                className="bg-white p-4 rounded shadow"
              >
                <button
                  data-testid="toggle-button"
                  onClick={() => toggleProductAccordion(product.id)}
                  className="w-full text-left font-semibold"
                >
                  {product.name} - {product.price}원 (재고: {product.stock})
                </button>
                {openProductIds.has(product.id) && (
                  <div className="mt-2">
                    {editingProduct && editingProduct.id === product.id ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block mb-1">상품명: </label>
                          <input
                            type="text"
                            value={editingProduct.name}
                            onChange={(e) => handleProductNameUpdate(product.id, e.target.value)}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block mb-1">가격: </label>
                          <input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) =>
                              handlePriceUpdate(product.id, parseInt(e.target.value, 10))
                            }
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block mb-1">재고: </label>
                          <input
                            type="number"
                            value={editingProduct.stock}
                            onChange={(e) =>
                              handleStockUpdate(product.id, parseInt(e.target.value, 10))
                            }
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        {/* 할인 정보 수정 부분 */}
                        <div className="space-y-2">
                          <h4 className="text-lg font-semibold">할인 정보</h4>
                          {editingProduct.discounts.map((discount, index) => {
                            const key = `${index}-${discount.rate}`;
                            return (
                              <div key={key} className="flex justify-between items-center">
                                <span>
                                  {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
                                </span>
                                <TextButton
                                  variant="danger"
                                  title="삭제"
                                  onClick={() => handleRemoveDiscount(product.id, index)}
                                  className="px-2 py-1"
                                />
                              </div>
                            );
                          })}
                          <div className="flex space-x-2">
                            <input
                              type="number"
                              placeholder="수량"
                              value={newDiscount.quantity}
                              onChange={(e) =>
                                setNewDiscount({
                                  ...newDiscount,
                                  quantity: parseInt(e.target.value, 10),
                                })
                              }
                              className="w-full p-2 border rounded"
                            />
                            <input
                              type="number"
                              placeholder="할인율 (%)"
                              value={newDiscount.rate * 100}
                              onChange={(e) =>
                                setNewDiscount({
                                  ...newDiscount,
                                  rate: parseInt(e.target.value, 10) / 100,
                                })
                              }
                              className="w-full p-2 border rounded"
                            />
                            <TextButton
                              variant="add"
                              title="할인 추가"
                              onClick={() => handleAddDiscount(product.id)}
                              fullWidth
                            />
                          </div>
                        </div>
                        <TextButton
                          variant="complete"
                          title="수정 완료"
                          onClick={handleEditComplete}
                          className="px-2 py-1"
                        />
                      </div>
                    ) : (
                      <div>
                        {product.discounts.map((discount, index) => {
                          const key = `${discount.rate}-${index}`;
                          return (
                            <div key={key} className="mb-2">
                              <span>
                                {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
                              </span>
                            </div>
                          );
                        })}
                        <TextButton
                          testId="modify-button"
                          variant="add"
                          title="수정"
                          onClick={() => handleEditProduct(product)}
                          className="px-2 py-1"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
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
      </div>
    </div>
  );
}
