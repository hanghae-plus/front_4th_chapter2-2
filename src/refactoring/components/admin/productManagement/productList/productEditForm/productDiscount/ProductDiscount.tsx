import { useProducts } from "../../../../../../hooks";

export interface ProductDiscountProps {
  productId: string;
}

export const ProductDiscount = ({ productId }: ProductDiscountProps) => {
  const { selectedProducts, updateEditProduct } = useProducts();

  return (
    <div>
      <div className="mt-2">
        {selectedProducts.get(productId)?.discounts.map((discount, index) => (
          <div key={index} className="mb-2">
            <span>
              {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
            </span>
          </div>
        ))}
        <button
          data-testid="modify-button"
          onClick={() => updateEditProduct(productId)}
          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
        >
          수정
        </button>
      </div>
    </div>
  );
};
