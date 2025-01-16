import { useProducts } from '../../../../../../hooks';
import Title from '../../../../../atoms/Title';

export const ProductEditDiscount = () => {
  const { editingProduct, removeDiscount } = useProducts();

  if (!editingProduct) {
    return;
  }
  return (
    <div>
      <Title level={4} text={'할인 정보'} />
      {editingProduct.discounts.map((discount, index) => (
        <div key={index} className="flex justify-between items-center mb-2">
          <span>
            {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
          </span>
          <button
            onClick={() => removeDiscount(editingProduct.id, index)}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  );
};
