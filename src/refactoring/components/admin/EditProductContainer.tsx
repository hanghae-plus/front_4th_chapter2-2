import { useState } from "react";
import { Product } from "../../../types.ts";
import { EditProductForm } from "./EditProductForm.tsx";

interface Props {
  product: Product;
  onProductUpdate: (updatedProduct: Product) => void;
}

export const EditProductContainer = ({ product, onProductUpdate }: Props) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const toggleEditForm = () => {
    setShowEditForm((prev) => !prev);
  };

  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const isOpenProductAccordion = openProductIds.has(product.id);
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

  return (
    <>
      <button
        data-testid="toggle-button"
        onClick={() => toggleProductAccordion(product.id)}
        className="w-full text-left font-semibold"
      >
        {product.name} - {product.price}원 (재고: {product.stock})
      </button>
      {isOpenProductAccordion && (
        <div className="mt-2">
          {showEditForm ? (
            <EditProductForm
              product={product}
              onProductUpdate={onProductUpdate}
              toggleEditForm={toggleEditForm}
            />
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
                onClick={toggleEditForm}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
              >
                수정
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
