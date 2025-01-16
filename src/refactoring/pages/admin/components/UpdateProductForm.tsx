import { Discount, Product } from "../../../../types";
import InputField from "../../../components/InputField";

interface Props {
  product: Product;
  editingProduct: Product;
  newDiscount: Discount;
  setNewDiscount: React.Dispatch<React.SetStateAction<Discount>>;
  updateProductField: (field: keyof Product, value: any) => void;
  handleRemoveDiscount: (productId: string, index: number) => void;
  handleEditComplete: () => void;
  handleAddDiscount: (productId: string) => void;
}

const UpdateProductForm = ({
  product,
  editingProduct,
  newDiscount,
  setNewDiscount,
  updateProductField,
  handleRemoveDiscount,
  handleAddDiscount,
  handleEditComplete,
}: Props) => {
  return (
    <div>
      <InputField
        label="상품명"
        value={product.name}
        onChange={(e) => updateProductField("name", e.target.value)}
      />
      <InputField
        label="가격"
        value={product.price}
        type="number"
        onChange={(e) =>
          updateProductField("price", parseFloat(e.target.value))
        }
      />
      <InputField
        label="재고"
        value={product.stock}
        type="number"
        onChange={(e) => updateProductField("stock", parseInt(e.target.value))}
      />
      {/* 할인 정보 수정 부분 */}
      <div>
        <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
        <UpdateDiscountForm 
          editingProduct={editingProduct}
          handleRemoveDiscount={handleRemoveDiscount}
          productId={product.id}
        />
        <AddDiscountForm 
          newDiscount={newDiscount}
          setNewDiscount={setNewDiscount}
          handleAddDiscount={handleAddDiscount}
          productId={product.id}
        />
      </div>
      <button
        onClick={handleEditComplete}
        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
      >
        수정 완료
      </button>
    </div>
  );
};

export default UpdateProductForm;

// 할인 정보 수정 폼
const UpdateDiscountForm = ({
  editingProduct,
  handleRemoveDiscount,
  productId
}: {
  editingProduct: Product;
  handleRemoveDiscount: (productId: string, index: number) => void;
  productId: string
}) => {
  return (
    <>
      {editingProduct.discounts.map((discount, index) => (
        <div key={index} className="flex justify-between items-center mb-2">
          <span>
            {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
          </span>
          <button
            onClick={() => handleRemoveDiscount(productId, index)}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            삭제
          </button>
        </div>
      ))}
    </>
  );
};

// 할인 정보 추가 폼
const AddDiscountForm = ({
  newDiscount,
  setNewDiscount,
  handleAddDiscount,
  productId
}: {
  newDiscount: Discount;
  setNewDiscount: React.Dispatch<React.SetStateAction<Discount>>;
  handleAddDiscount: (productId: string) => void;
  productId: string
}) => {
  return (
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
        onClick={() => handleAddDiscount(productId)}
        className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        할인 추가
      </button>
    </div>
  );
};
