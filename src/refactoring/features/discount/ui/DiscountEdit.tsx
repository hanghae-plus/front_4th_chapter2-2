import { Discount } from './Discount.tsx';
import { DiscountForm } from './DiscountForm.tsx';
import { useEditingProductContext } from '../../product/model';

export function DiscountEdit() {
  const { editingProduct } = useEditingProductContext();
  return (
    <div>
      <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
      {editingProduct.discounts.map((_, index) => (
        <Discount key={index} index={index} />
      ))}
      <DiscountForm />
    </div>
  );
}
