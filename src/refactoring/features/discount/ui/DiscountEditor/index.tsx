import { Discount } from '../../../../../types';
import { BulkDiscountInput } from '../BulkDiscountInput';
import { EditableDiscountList } from '../EditableDiscountList';
import { useDiscountEditor } from '../../model/useDiscountEditor';

interface DiscountEditorProps {
  initialDiscounts: Discount[];
  onUpdate: (discounts: Discount[]) => void;
}

export function DiscountEditor({ initialDiscounts, onUpdate }: DiscountEditorProps) {
  const { discounts, handleAddDiscount, handleRemoveDiscount } = useDiscountEditor({
    initialDiscounts,
    onUpdate,
  });

  return (
    <div className="space-y-2">
      <h4 className="text-lg font-semibold">할인 정보 수정</h4>
      <EditableDiscountList discounts={discounts} onRemoveDiscount={handleRemoveDiscount} />
      <BulkDiscountInput onAddDiscount={handleAddDiscount} />
    </div>
  );
}
