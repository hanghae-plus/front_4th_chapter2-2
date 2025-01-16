import { useState } from "react";
import { Product } from "../../../../../types";
import validateProduct from "../../../../lib/validateProduct";

interface ValidationErrors {
  name?: string;
  price?: string;
  stock?: string;
}

interface ProductAddFormProps {
  newProduct: Omit<Product, "id">;
  setNewProduct: (newProduct: Omit<Product, "id">) => void;
  handleAddNewProduct: () => void;
}

function ProductAddForm(props: ProductAddFormProps) {
  const { newProduct, setNewProduct, handleAddNewProduct } = props;
  const [errors, setErrors] = useState<ValidationErrors>({});

  function handleSubmit() {
    const validationErrors = validateProduct(newProduct);
    if (Object.keys(validationErrors).length === 0) {
      handleAddNewProduct();
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  }

  return (
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
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
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
            setNewProduct({
              ...newProduct,
              price: parseInt(e.target.value),
            })
          }
          className="w-full p-2 border rounded"
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price}</p>
        )}
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
            setNewProduct({
              ...newProduct,
              stock: parseInt(e.target.value),
            })
          }
          className="w-full p-2 border rounded"
        />
        {errors.stock && (
          <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
        )}
      </div>
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        추가
      </button>
    </div>
  );
}

export default ProductAddForm;
