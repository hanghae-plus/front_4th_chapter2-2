import { Discount } from '../../../../types';
import { DiscountCondition } from '../../../entities/discount/ui/DiscountCondition';
import { TextButton } from '../../../shared/ui';

interface EditableDiscountListProps {
  discounts: Discount[];
  onRemoveDiscount: (index: number) => void;
  className?: string;
}

export function EditableDiscountList({
  discounts,
  onRemoveDiscount,
  className = '',
}: EditableDiscountListProps) {
  return (
    <div className={className}>
      {discounts.map((discount, index) => {
        const key = `${discount.rate}-${discount.quantity}-${index}`;
        return (
          <div key={key} className="flex justify-between items-center py-2">
            <DiscountCondition discounts={[discount]} variant="plain" />
            <TextButton variant="danger" title="삭제" onClick={() => onRemoveDiscount(index)} />
          </div>
        );
      })}
    </div>
  );
}
