import React from 'react';
import { useDiscount } from '../../hooks/admin/useDiscount';
import { useEditProduct } from '../../hooks/admin/useEditProduct';
import { Product } from '../../models/types/Product';

interface ProductUpdateFormProps {
  products: Product[];
  product: Product;
  onProductUpdate: (product: Product) => void;
  closeEditForm: () => void;
}

function ProductUpdateForm({
  products,
  product,
  onProductUpdate,
  closeEditForm,
}: ProductUpdateFormProps) {
  const {
    editingProduct,
    handlers: {
      handleEditProduct,
      handleProductNameUpdate,
      handlePriceUpdate,
      handleStockUpdate,
      handleEditComplete,
    },
  } = useEditProduct({ currentProduct: product });
  const {
    newDiscount,
    handlers: {
      handleAddDiscount,
      handleRemoveDiscount,
      handleUpdateNewDiscountQuantity,
      handleUpdateNewDiscountRate,
    },
  } = useDiscount({
    products,
    updateProduct: onProductUpdate,
    updateEditingProduct: handleEditProduct,
  });
  if (!editingProduct) {
    return null;
  }
  return (
    <div>
      <div className="mb-4">
        <span className="block mb-1">상품명: </span>
        <input
          type="text"
          value={editingProduct.name}
          onChange={(e) => handleProductNameUpdate(product.id, e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <span className="block mb-1">가격: </span>
        <input
          type="number"
          value={editingProduct.price}
          onChange={(e) =>
            handlePriceUpdate(product.id, Number(e.target.value))
          }
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <span className="block mb-1">재고: </span>
        <input
          type="number"
          value={editingProduct.stock}
          onChange={(e) =>
            handleStockUpdate(product.id, Number(e.target.value))
          }
          className="w-full p-2 border rounded"
        />
      </div>
      {/* 할인 정보 수정 부분 */}
      <div>
        <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
        {editingProduct.discounts.map((discount, index) => (
          <div
            key={discount.rate}
            className="flex justify-between items-center mb-2"
          >
            <span>
              {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
            </span>
            <button
              type="button"
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
            value={newDiscount.quantity}
            onChange={(e) =>
              handleUpdateNewDiscountQuantity(Number(e.target.value))
            }
            className="w-1/3 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="할인율 (%)"
            value={newDiscount.rate * 100}
            onChange={(e) =>
              handleUpdateNewDiscountRate(Number(e.target.value) / 100)
            }
            className="w-1/3 p-2 border rounded"
          />
          <button
            type="button"
            onClick={() => handleAddDiscount(product.id)}
            className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            할인 추가
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={() =>
          handleEditComplete((completedProduct) => {
            onProductUpdate(completedProduct);
            closeEditForm();
          })
        }
        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
      >
        수정 완료
      </button>
    </div>
  );
}

export default ProductUpdateForm;
