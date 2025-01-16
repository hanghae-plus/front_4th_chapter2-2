import { Product } from '../../../types';
import { useAdminEditingProduct } from '../../hooks/useAdminEditingProduct';
import {
  checkProduct,
  removeProductDiscount,
  updateProductNewDiscount,
} from '../../models';

interface Props {
  products: Product[];
  product: Product;
  index: number;
  openProductIds: Set<string>;
  onClickToggleButton: (productId: string) => void;
  onProductUpdate: (updatedProduct: Product) => void;
}

export const AdminEditingProduct = ({
  products,
  product,
  index,
  openProductIds,
  onProductUpdate,
  onClickToggleButton,
}: Props) => {
  const {
    editingProduct,
    newDiscount,
    handleFieldUpdate,
    handleEditProduct,
    handleEditDiscount,
    handleClearProduct,
    handleClearDiscount,
  } = useAdminEditingProduct();

  // 상품 수정 완료 핸들러 함수
  const handleEditComplete = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      handleClearProduct();
    }
  };

  const handleRemoveDiscount = (productId: string, index: number) => {
    const updatedProduct = checkProduct(products, productId);
    if (updatedProduct) {
      const newProduct = removeProductDiscount(updatedProduct, index);

      onProductUpdate(newProduct);
      handleEditProduct(newProduct);
    }
  };

  // 상품
  const handleAddDiscount = (productId: string) => {
    const updatedProduct = checkProduct(products, productId);
    if (updatedProduct && editingProduct) {
      const newProduct = updateProductNewDiscount(updatedProduct, newDiscount);

      onProductUpdate(newProduct);
      handleEditProduct(newProduct);
      handleClearDiscount();
    }
  };

  return (
    <div
      data-testid={`product-${index + 1}`}
      className="bg-white p-4 rounded shadow"
    >
      <button
        data-testid="toggle-button"
        onClick={() => onClickToggleButton(product.id)}
        className="w-full text-left font-semibold"
      >
        {product.name} - {product.price}원 (재고: {product.stock})
      </button>
      {openProductIds.has(product.id) && (
        <div className="mt-2">
          {editingProduct && editingProduct.id === product.id ? (
            <div>
              <div className="mb-4">
                <label className="block mb-1">상품명: </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) =>
                    handleFieldUpdate(product.id, { name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">가격: </label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    handleFieldUpdate(product.id, {
                      price: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">재고: </label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) =>
                    handleFieldUpdate(product.id, {
                      stock: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              {/* 할인 정보 수정 부분 */}
              <div>
                <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
                {editingProduct.discounts.map((discount, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-2"
                  >
                    <span>
                      {discount.quantity}개 이상 구매 시 {discount.rate * 100}%
                      할인
                    </span>
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
                    value={newDiscount.quantity}
                    onChange={(e) =>
                      handleEditDiscount({
                        ...newDiscount,
                        quantity: parseInt(e.target.value),
                      })
                    }
                    className="w-1/3 p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="할인율 (%)"
                    value={newDiscount.rate * 100}
                    onChange={(e) =>
                      handleEditDiscount({
                        ...newDiscount,
                        rate: parseInt(e.target.value) / 100,
                      })
                    }
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
              {product.discounts.map((discount, index) => (
                <div key={index} className="mb-2">
                  <span>
                    {discount.quantity}개 이상 구매 시 {discount.rate * 100}%
                    할인
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
  );
};
