import { useState } from "react";
import { Product, AdminProductListProps } from "../../../types";
import { ProductForm } from "./AdminProductForm";
import { useProductAccordion } from "../../hooks/useProductAccordion";
import { useEditingProduct } from "../../hooks/useEditingProduct";
import { useDiscounts } from "../../hooks/useDiscounts";

export const ProductList = ({ products, onProductUpdate, onProductAdd }: AdminProductListProps) => {
  const { openProductIds, toggleProductAccordion } = useProductAccordion();
  const { editingProduct, startEditing, stopEditing, updateProductField, setEditingProduct } = useEditingProduct();
  const { newDiscount, setNewDiscount, addDiscount } = useDiscounts();
  
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  // handleEditProduct 함수 수정
  const handleProductAdd = (newProduct: Product) => {
    onProductAdd(newProduct);
  };

  // 수정 완료 핸들러 함수 추가
  const handleEditComplete = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      stopEditing();
    }
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    const updatedProduct = products.find(p => p.id === productId);
    if (updatedProduct) {
      const newProduct = { ...updatedProduct, stock: newStock };
      // 이 부분에서 onProductUpdate 호출
      onProductUpdate(newProduct);
      setEditingProduct(newProduct); // 수정된 제품을 state로 반영
    }
  };

  const handleAddDiscount = (productId: string) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedDiscounts = addDiscount(editingProduct.discounts, newDiscount);
      const updatedProduct = {
        ...editingProduct,
        discounts: updatedDiscounts
      };
      setEditingProduct(updatedProduct);
      onProductUpdate(updatedProduct);
      
      // Reset discount input fields
      setNewDiscount({ quantity: 0, rate: 0 });
    }
  };

  const handleRemoveDiscount = (productId: string, index: number) => {
    const product = products.find(p => p.id === productId);
    if (product && editingProduct && editingProduct.id === productId) {
      const updatedDiscounts = [...editingProduct.discounts];
      updatedDiscounts.splice(index, 1);
      
      const updatedProduct = {
        ...editingProduct,
        discounts: updatedDiscounts
      };
      
      setEditingProduct(updatedProduct);
      onProductUpdate(updatedProduct);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
      <button
        onClick={() => setShowNewProductForm(!showNewProductForm)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
      >
        {showNewProductForm ? "취소" : "새 상품 추가"}
      </button>
      {showNewProductForm && (
        <ProductForm onProductAdd={handleProductAdd} />
      )}
      <div className="space-y-2">
        {products.map((product, index) => (
          <div key={product.id} data-testid={`product-${index + 1}`} className="bg-white p-4 rounded shadow">
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
                      <label htmlFor="productName" className="block mb-1">상품명: </label>
                      <input
                        id="productName"
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) => updateProductField("name", e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="productPrice" className="block mb-1">가격: </label>
                      <input
                        id="productPrice"
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) => updateProductField("price", parseInt(e.target.value))}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="productStock" className="block mb-1">재고: </label>
                      <input
                        id="productStock"
                        type="number"
                        value={editingProduct.stock}
                        onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value))}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    {/* 할인 정보 수정 부분 */}
                    <div>
                      <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
                      {editingProduct.discounts.map((discount, index) => (
                        <div key={index} className="flex justify-between items-center mb-2">
                          <span>{discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인</span>
                          <button
                            onClick={() => handleRemoveDiscount(product.id, index)}
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
                          value={newDiscount.quantity || ""}
                          onChange={(e) => setNewDiscount({ ...newDiscount, quantity: parseInt(e.target.value) })}
                          className="w-1/3 p-2 border rounded"
                        />
                        <input
                          type="number"
                          placeholder="할인율 (%)"
                          value={newDiscount.rate ? newDiscount.rate * 100 : ""}
                          onChange={(e) => setNewDiscount({ ...newDiscount, rate: parseInt(e.target.value) / 100 })}
                          className="w-1/3 p-2 border rounded"
                        />
                        <button
                          onClick={() => handleAddDiscount(product.id)}
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
                    {product.discounts.length > 0 ? (
                      product.discounts.map((discount, index) => (
                        <div key={index} className="mb-2">
                          <span data-testid={`discount-${index}`}>
                            {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="mb-2">할인 정보가 없습니다.</div>
                    )}
                    <button
                      data-testid="modify-button"
                      onClick={() => startEditing(product)}
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
  );
};