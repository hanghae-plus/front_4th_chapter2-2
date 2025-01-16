import React from 'react';
import { useCreateProduct } from '../../hooks/admin/useCreateProduct';
import { useProducts } from '../../hooks';

interface Props {
  isOpen: boolean;
  setFormState: React.Dispatch<React.SetStateAction<boolean>>;
}

function ProductForm({ isOpen, setFormState }: Props) {
  const { addProduct } = useProducts();
  const {
    newProduct,
    handlers: {
      handleAddNewProduct,
      handleUpdateNewProductName,
      handleUpdateNewProductPrice,
      handleUpdateNewProductStock,
    },
  } = useCreateProduct({ addProduct });
  if (!isOpen) return null;

  const onAddProductAndClose = () => {
    handleAddNewProduct();
    setFormState(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
      <div className="mb-2">
        <label
          htmlFor="productName"
          className="block text-sm font-medium text-gray-700"
        >
          상품명
          <input
            id="productName"
            type="text"
            value={newProduct.name}
            onChange={(e) => handleUpdateNewProductName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>
      </div>
      <div className="mb-2">
        <label
          htmlFor="productPrice"
          className="block text-sm font-medium text-gray-700"
        >
          가격
          <input
            id="productPrice"
            type="number"
            value={newProduct.price}
            onChange={(e) =>
              handleUpdateNewProductPrice(Number(e.target.value))
            }
            className="w-full p-2 border rounded"
          />
        </label>
      </div>
      <div className="mb-2">
        <label
          htmlFor="productStock"
          className="block text-sm font-medium text-gray-700"
        >
          재고
          <input
            id="productStock"
            type="number"
            value={newProduct.stock}
            onChange={(e) =>
              handleUpdateNewProductStock(Number(e.target.value))
            }
            className="w-full p-2 border rounded"
          />
        </label>
      </div>
      <button
        type="button"
        onClick={onAddProductAndClose}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        추가
      </button>
    </div>
  );
}

export default ProductForm;
