import { useState } from "react";
import { Product } from "../../../types";
import { FormField } from "../../shared/_components/FormField";

type AddProductFormProps = {
  onSubmitAddProduct: (product: Product) => void;
};

export const AddProductForm = ({ onSubmitAddProduct }: AddProductFormProps) => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    stock: 0,
    discounts: [],
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const productWithId = { ...newProduct, id: Date.now().toString() };
    onSubmitAddProduct(productWithId);
    resetForm();
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      price: 0,
      stock: 0,
      discounts: [],
    });
    setShowNewProductForm(false);
  };

  return (
    <>
      <button
        onClick={() => setShowNewProductForm(!showNewProductForm)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
      >
        {showNewProductForm ? "취소" : "새 상품 추가"}
      </button>
      {showNewProductForm && (
        <form onSubmit={handleSubmit}>
          <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
            <FormField
              id="productName"
              label="상품명"
              value={newProduct.name}
              onChange={(value) =>
                setNewProduct({ ...newProduct, name: value })
              }
            />
            <FormField
              id="productPrice"
              label="가격"
              type="number"
              value={newProduct.price}
              onChange={(value) =>
                setNewProduct({ ...newProduct, price: parseInt(value) })
              }
            />
            <FormField
              id="productStock"
              label="재고"
              type="number"
              value={newProduct.stock}
              onChange={(value) =>
                setNewProduct({ ...newProduct, stock: parseInt(value) })
              }
            />
            <button
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              type="submit"
            >
              추가
            </button>
          </div>
        </form>
      )}
    </>
  );
};
