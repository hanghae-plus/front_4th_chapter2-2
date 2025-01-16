import { useState } from 'react';
import { Coupon, Discount, Membership, Product } from '../../types.ts';
import { usePreservedCallback } from '../hooks/usePreservedCallback.ts';
import { validateProductData } from '../lib/validateProductData.ts';

interface Props {
  products: Product[];
  memberships: Membership[];
  coupons: Coupon[];
  onProductAdd: (newProduct: Product) => void;
  onProductUpdate: (updatedProduct: Product) => void;
  onProductDelete: (id: string) => void;
  onMembershipAdd: (newMembership: Membership) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const AdminPage = ({
  products,
  memberships,
  coupons,
  onProductAdd,
  onProductUpdate,
  onProductDelete,
  onMembershipAdd,
  onCouponAdd,
}: Props) => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });
  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0,
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
    if (!validateProductData(product)) return;
    setEditingProduct({ ...product });
  };

  // handleDeleteProduct 함수 추가
  const handleDeleteProduct = (id: string) => {
    onProductDelete(id);
  };

  // 새로운 핸들러 함수 추가
  const handleProductNameUpdate = (productId: string, newName: string) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, name: newName };

      if (!validateProductData(updatedProduct)) return;

      setEditingProduct(updatedProduct);
    }
  };

  // 새로운 핸들러 함수 추가
  const handlePriceUpdate = (productId: string, newPrice: number) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, price: newPrice };

      if (!validateProductData(updatedProduct)) return;

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
      const newProduct = { ...updatedProduct, stock: newStock };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  };

  const handleAddDiscount = (productId: string) => {
    const updatedProduct = products.find((p) => p.id === productId);
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
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: updatedProduct.discounts.filter((_, i) => i !== index),
      };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
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
      <h1 className="mb-6 text-3xl font-bold">관리자 페이지</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">상품 관리</h2>
          <button
            onClick={() => setShowNewProductForm(!showNewProductForm)}
            className="mb-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            {showNewProductForm ? '취소' : '새 상품 추가'}
          </button>
          {showNewProductForm && (
            <div className="mb-4 rounded bg-white p-4 shadow">
              <h3 className="mb-2 text-xl font-semibold">새 상품 추가</h3>
              <div className="mb-2">
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                  상품명
                </label>
                <input
                  id="productName"
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full rounded border p-2"
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
                    setNewProduct({ ...newProduct, price: parseInt(e.target.value) })
                  }
                  className="w-full rounded border p-2"
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
                    setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })
                  }
                  className="w-full rounded border p-2"
                />
              </div>
              <button
                onClick={handleAddNewProduct}
                className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
              >
                추가
              </button>
            </div>
          )}
          <div className="space-y-2">
            {products.map((product, index) => (
              <div
                key={product.id}
                data-testid={`product-${index + 1}`}
                className="rounded bg-white p-4 shadow"
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
                      <div>
                        <div className="mb-4">
                          <label className="mb-1 block">상품명: </label>
                          <input
                            type="text"
                            value={editingProduct.name}
                            onChange={(e) => handleProductNameUpdate(product.id, e.target.value)}
                            className="w-full rounded border p-2"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="mb-1 block">가격: </label>
                          <input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) =>
                              handlePriceUpdate(product.id, parseInt(e.target.value))
                            }
                            className="w-full rounded border p-2"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="mb-1 block">재고: </label>
                          <input
                            type="number"
                            value={editingProduct.stock}
                            onChange={(e) =>
                              handleStockUpdate(product.id, parseInt(e.target.value))
                            }
                            className="w-full rounded border p-2"
                          />
                        </div>
                        {/* 할인 정보 수정 부분 */}
                        <div>
                          <h4 className="mb-2 text-lg font-semibold">할인 정보</h4>
                          {editingProduct.discounts.map((discount, index) => (
                            <div key={index} className="mb-2 flex items-center justify-between">
                              <span>
                                {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
                              </span>
                              <button
                                onClick={() => handleRemoveDiscount(product.id, index)}
                                className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                              >
                                삭제
                              </button>
                            </div>
                          ))}
                          <div className="flex space-x-2">
                            <input
                              type="number"
                              placeholder="수량"
                              value={newDiscount.quantity}
                              onChange={(e) =>
                                setNewDiscount({
                                  ...newDiscount,
                                  quantity: parseInt(e.target.value),
                                })
                              }
                              className="w-1/3 rounded border p-2"
                            />
                            <input
                              type="number"
                              placeholder="할인율 (%)"
                              value={newDiscount.rate * 100}
                              onChange={(e) =>
                                setNewDiscount({
                                  ...newDiscount,
                                  rate: parseInt(e.target.value) / 100,
                                })
                              }
                              className="w-1/3 rounded border p-2"
                            />
                            <button
                              onClick={() => handleAddDiscount(product.id)}
                              className="w-1/3 rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
                            >
                              할인 추가
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={handleEditComplete}
                          className="mt-2 rounded bg-green-500 px-2 py-1 text-white hover:bg-green-600"
                        >
                          수정 완료
                        </button>
                      </div>
                    ) : (
                      <div>
                        {product.discounts.map((discount, index) => (
                          <div key={index} className="mb-2">
                            <span>
                              {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
                            </span>
                          </div>
                        ))}
                        <button
                          data-testid="modify-button"
                          onClick={() => handleEditProduct(product)}
                          className="mt-2 rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                        >
                          수정
                        </button>
                        <button
                          data-testid="delete-button"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="ml-2 mt-2 rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                        >
                          삭제
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
          <MembershipManager memberships={memberships} onMembershipAdd={onMembershipAdd} />
          <CouponManager coupons={coupons} onCouponAdd={onCouponAdd} />
        </div>
      </div>
    </div>
  );
};

/** -----------------------------------------------------------------------------------------------
 * Subconponents
 * --------------------------------------------------------------------------------------------- */

interface MembershipManagerProps {
  memberships: Membership[];
  onMembershipAdd: (newMembership: Membership) => void;
}

const MembershipManager = ({ memberships, onMembershipAdd }: MembershipManagerProps) => {
  const [newMembership, setNewMembership] = useState<Membership>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });

  const handleMembershipAdd = usePreservedCallback(() => {
    onMembershipAdd(newMembership);
    setNewMembership({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
    });
  });

  return (
    <>
      <h2 className="mb-4 text-2xl font-semibold">맴버쉽 관리</h2>
      <div className="mb-8 rounded bg-white p-4 shadow">
        <div className="mb-4 space-y-2">
          <input
            className="w-full rounded border p-2"
            type="text"
            placeholder="맴버쉽 이름"
            value={newMembership.name}
            onChange={(e) => setNewMembership({ ...newMembership, name: e.target.value })}
          />
          <input
            className="w-full rounded border p-2"
            type="text"
            placeholder="맴버쉽 코드"
            value={newMembership.code}
            onChange={(e) => setNewMembership({ ...newMembership, code: e.target.value })}
          />
          <div className="flex gap-2">
            <select
              className="w-full rounded border p-2"
              value={newMembership.discountType}
              onChange={(e) =>
                setNewMembership({
                  ...newMembership,
                  discountType: e.target.value as 'amount' | 'percentage',
                })
              }
            >
              <option value="amount">금액(원)</option>
              <option value="percentage">할인율(%)</option>
            </select>
            <input
              className="w-full rounded border p-2"
              type="number"
              placeholder="할인 값"
              value={newMembership.discountValue}
              onChange={(e) =>
                setNewMembership({ ...newMembership, discountValue: parseInt(e.target.value) })
              }
            />
          </div>
          <button
            className="w-full rounded bg-green-500 p-2 text-white hover:bg-green-600"
            onClick={handleMembershipAdd}
          >
            맴버쉽 추가
          </button>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-semibold">현재 맴버쉽 목록</h3>
          <div className="space-y-2">
            {memberships.map((membership, index) => (
              <div
                key={index}
                className="rounded bg-gray-100 p-2"
                data-testid={`membership-${index + 1}`}
              >
                {membership.name} ({membership.code}): {`${membership.discountValue}% 할인`}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

/* --------------------------------------------------------------------------------------------- */

interface CouponManagerProps {
  coupons: Coupon[];
  onCouponAdd: (newCoupon: Coupon) => void;
}

const CouponManager = ({ coupons, onCouponAdd }: CouponManagerProps) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });

  const handleCouponAdd = usePreservedCallback(() => {
    onCouponAdd(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
    });
  });

  return (
    <>
      <h2 className="mb-4 text-2xl font-semibold">쿠폰 관리</h2>
      <div className="rounded bg-white p-4 shadow">
        <div className="mb-4 space-y-2">
          <input
            className="w-full rounded border p-2"
            type="text"
            placeholder="쿠폰 이름"
            value={newCoupon.name}
            onChange={(e) => setNewCoupon({ ...newCoupon, name: e.target.value })}
          />
          <input
            className="w-full rounded border p-2"
            type="text"
            placeholder="쿠폰 코드"
            value={newCoupon.code}
            onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
          />
          <div className="flex gap-2">
            <select
              className="w-full rounded border p-2"
              value={newCoupon.discountType}
              onChange={(e) =>
                setNewCoupon({
                  ...newCoupon,
                  discountType: e.target.value as 'amount' | 'percentage',
                })
              }
            >
              <option value="amount">금액(원)</option>
              <option value="percentage">할인율(%)</option>
            </select>
            <input
              className="w-full rounded border p-2"
              type="number"
              placeholder="할인 값"
              value={newCoupon.discountValue}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, discountValue: parseInt(e.target.value) })
              }
            />
          </div>
          <button
            className="w-full rounded bg-green-500 p-2 text-white hover:bg-green-600"
            onClick={handleCouponAdd}
          >
            쿠폰 추가
          </button>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-semibold">현재 쿠폰 목록</h3>
          <div className="space-y-2">
            {coupons.map((coupon, index) => (
              <div
                key={index}
                className="rounded bg-gray-100 p-2"
                data-testid={`coupon-${index + 1}`}
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
    </>
  );
};
