import { useState } from "react";
import { Coupon, Product } from "../../../types.ts";
import {
  useCouponManager,
  useDiscountManager,
  useNewProductManager,
  useProductEditor,
} from "./hooks";
import { formatCouponDisplay } from "../../models";

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
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());

  const {
    editingProduct,
    setEditingProduct,
    handleEditProduct,
    handleProductFieldUpdate,
    handleEditComplete,
  } = useProductEditor(onProductUpdate);

  const { newCoupon, handleCouponChange, handleAddCoupon } =
    useCouponManager(onCouponAdd);

  const {
    newDiscount,
    handleAddDiscount,
    handleRemoveDiscount,
    handleDiscountChange,
  } = useDiscountManager(onProductUpdate);

  const {
    showNewProductForm,
    newProduct,
    handleProductFieldChange,
    handleAddNewProduct,
    toggleNewProductForm,
  } = useNewProductManager(onProductAdd);

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(productId) ? newSet.delete(productId) : newSet.add(productId);
      return newSet;
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 상품 관리 섹션 */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
          <button
            onClick={toggleNewProductForm}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
          >
            {showNewProductForm ? "취소" : "새 상품 추가"}
          </button>

          {/* 새 상품 추가 폼 */}
          {showNewProductForm && (
            <div className="bg-white p-4 rounded shadow mb-4">
              <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
              <div className="mb-2">
                <label
                  htmlFor="productName"
                  className="block text-sm font-medium text-gray-700"
                >
                  상품명
                </label>
                <input
                  id="productName"
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    handleProductFieldChange("name", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="productPrice"
                  className="block text-sm font-medium text-gray-700"
                >
                  가격
                </label>
                <input
                  id="productPrice"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    handleProductFieldChange("price", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="productStock"
                  className="block text-sm font-medium text-gray-700"
                >
                  재고
                </label>
                <input
                  id="productStock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) =>
                    handleProductFieldChange("stock", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                onClick={handleAddNewProduct}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                추가
              </button>
            </div>
          )}

          {/* 상품 목록 */}
          <div data-testid={"product-list"} className="space-y-2">
            {products.map((product, index) => (
              <div
                key={product.id}
                data-testid={`product-${index + 1}`}
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
                      <div>
                        {/* 상품 수정 폼 */}
                        <div className="mb-4">
                          <label className="block mb-1">상품명: </label>
                          <input
                            type="text"
                            value={editingProduct.name}
                            onChange={(e) =>
                              handleProductFieldUpdate(
                                product.id,
                                "name",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border rounded"
                          />
                          <input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) =>
                              handleProductFieldUpdate(
                                product.id,
                                "price",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full p-2 border rounded"
                          />
                          <input
                            type="number"
                            value={editingProduct.stock}
                            onChange={(e) =>
                              handleProductFieldUpdate(
                                product.id,
                                "stock",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        {/* 할인 정보 수정 */}
                        <div>
                          <h4 className="text-lg font-semibold mb-2">
                            할인 정보
                          </h4>
                          {editingProduct.discounts.map((discount, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center mb-2"
                            >
                              <span>
                                {discount.quantity}개 이상 구매 시{" "}
                                {discount.rate * 100}% 할인
                              </span>
                              <button
                                onClick={() => {
                                  const updated = handleRemoveDiscount(
                                    editingProduct,
                                    index
                                  );
                                  setEditingProduct(updated);
                                }}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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
                                handleDiscountChange(
                                  "quantity",
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-1/3 p-2 border rounded"
                            />
                            <input
                              type="number"
                              placeholder="할인율 (%)"
                              value={newDiscount.rate * 100}
                              onChange={(e) =>
                                handleDiscountChange(
                                  "rate",
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-1/3 p-2 border rounded"
                            />
                            <button
                              onClick={() => {
                                if (editingProduct) {
                                  const updated =
                                    handleAddDiscount(editingProduct);
                                  setEditingProduct(updated);
                                }
                              }}
                              className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            >
                              할인 추가
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={handleEditComplete}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
                        >
                          수정 완료
                        </button>
                      </div>
                    ) : (
                      <div>
                        {product.discounts.map((discount, index) => (
                          <div key={index} className="mb-2">
                            <span>
                              {discount.quantity}개 이상 구매 시{" "}
                              {discount.rate * 100}% 할인
                            </span>
                          </div>
                        ))}
                        <button
                          data-testid="modify-button"
                          onClick={() => handleEditProduct(product)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
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

        {/* 쿠폰 관리 섹션 */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
          <div className="bg-white p-4 rounded shadow">
            <div className="space-y-2 mb-4">
              <input
                type="text"
                placeholder="쿠폰 이름"
                value={newCoupon.name}
                onChange={(e) => handleCouponChange("name", e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="쿠폰 코드"
                value={newCoupon.code}
                onChange={(e) => handleCouponChange("code", e.target.value)}
                className="w-full p-2 border rounded"
              />
              <div className="flex gap-2">
                <select
                  value={newCoupon.discountType}
                  onChange={(e) =>
                    handleCouponChange(
                      "discountType",
                      e.target.value as "amount" | "percentage"
                    )
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
                    handleCouponChange(
                      "discountValue",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                onClick={handleAddCoupon}
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                쿠폰 추가
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
              <div className="space-y-2">
                {coupons.map((coupon, index) => (
                  <div
                    key={index}
                    data-testid={`coupon-${index + 1}`}
                    className="bg-gray-100 p-2 rounded"
                  >
                    {coupon.name} ({coupon.code}):{formatCouponDisplay(coupon)}{" "}
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
