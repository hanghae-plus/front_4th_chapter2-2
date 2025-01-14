import { useState } from "react";
import { Discount, Product } from "../../../types";
import { EditFormField } from "./EditFormField";

type EditState = "closed" | "viewing" | "editing";

type StockProductProps = {
  product: Product;
  index: number;
  onEditComplete: (updatedProduct: Product) => void;
};

export const StockProduct = ({
  product,
  index,
  onEditComplete,
}: StockProductProps) => {
  const [editState, setEditState] = useState<EditState>("closed");

  const handleToggle = () => {
    setEditState((prev) => (prev === "closed" ? "viewing" : "closed"));
  };

  const handleEditClick = () => {
    setEditState("editing");
  };

  const handleEditComplete = (updatedProduct: Product) => {
    onEditComplete(updatedProduct);
    setEditState("viewing");
  };

  return (
    <div
      key={product.id}
      data-testid={`product-${index + 1}`}
      className="bg-white p-4 rounded shadow"
    >
      <button
        data-testid="toggle-button"
        onClick={handleToggle}
        className="w-full text-left font-semibold"
      >
        {product.name} - {product.price}원 (재고: {product.stock})
      </button>
      {editState !== "closed" && (
        <div className="mt-2">
          {editState === "editing" ? (
            <EditProductForm
              product={product}
              onEditComplete={handleEditComplete}
            />
          ) : (
            <ProductDiscountsInfo
              product={product}
              handleEditClick={handleEditClick}
            />
          )}
        </div>
      )}
    </div>
  );
};

const EditProductForm = ({
  product,
  onEditComplete,
}: {
  product: Product;
  onEditComplete: (updatedProduct: Product) => void;
}) => {
  const [editingProduct, setEditingProduct] = useState(product);
  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0,
  });

  const resetForm = () => {
    setEditingProduct(product);
    setNewDiscount({ quantity: 0, rate: 0 });
  };

  const handleSubmit = () => {
    onEditComplete(editingProduct);
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit}>
      <EditFormField
        id="name"
        label="상품명"
        value={editingProduct.name}
        onChange={(value) =>
          setEditingProduct({ ...editingProduct, name: value })
        }
      />
      <EditFormField
        id="price"
        label="가격"
        value={editingProduct.price}
        onChange={(value) =>
          setEditingProduct({ ...editingProduct, price: parseInt(value) })
        }
      />
      <EditFormField
        id="stock"
        label="재고"
        value={editingProduct.stock}
        onChange={(value) =>
          setEditingProduct({ ...editingProduct, stock: parseInt(value) })
        }
      />
      <div>
        <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
        {editingProduct.discounts.map((discount, index) => (
          <div key={index} className="flex justify-between items-center mb-2">
            <span>
              {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
            </span>
            <button
              type="button"
              onClick={() =>
                setEditingProduct({
                  ...editingProduct,
                  discounts: editingProduct.discounts.filter(
                    (_, i) => i !== index
                  ),
                })
              }
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
              setNewDiscount({
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
              setNewDiscount({
                ...newDiscount,
                rate: parseInt(e.target.value) / 100,
              })
            }
            className="w-1/3 p-2 border rounded"
          />
          <button
            type="button"
            onClick={() =>
              setEditingProduct({
                ...editingProduct,
                discounts: [...editingProduct.discounts, newDiscount],
              })
            }
            className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            할인 추가
          </button>
        </div>
      </div>
      <button
        type="submit"
        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
      >
        수정 완료
      </button>
    </form>
  );
};

const ProductDiscountsInfo = ({
  product,
  handleEditClick,
}: {
  product: Product;
  handleEditClick: () => void;
}) => {
  return (
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
        onClick={handleEditClick}
        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
      >
        수정
      </button>
    </div>
  );
};
