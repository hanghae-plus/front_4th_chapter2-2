import { useState } from 'react';
import { Discount } from '../../../../types';
import { TextButton } from '../../../shared/ui';
import { FormInput } from '../../../shared/ui/FormInput';

interface BulkDiscountInputProps {
  onAddDiscount: (discount: Discount) => void;
  className?: string;
}

export function BulkDiscountInput({ onAddDiscount, className = '' }: BulkDiscountInputProps) {
  const [discount, setDiscount] = useState<Discount>({ quantity: 0, rate: 0 });

  const handleQuantityChange = (value: string) => {
    const quantity = parseInt(value, 10) || 0;
    setDiscount((prev) => ({
      ...prev,
      quantity: quantity >= 0 ? quantity : 0,
    }));
  };

  const handleRateChange = (value: string) => {
    const rate = parseInt(value, 10) || 0;
    setDiscount((prev) => ({
      ...prev,
      rate: rate >= 0 && rate <= 100 ? rate / 100 : prev.rate,
    }));
  };

  const handleSubmit = () => {
    if (discount.quantity > 0 && discount.rate > 0) {
      onAddDiscount(discount);
      // 입력 필드 초기화
      setDiscount({ quantity: 0, rate: 0 });
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <FormInput
        label={null}
        placeholder="수량"
        value={discount.quantity || ''}
        min={0}
        max={100}
        onChange={(value) => handleQuantityChange(value)}
        className="w-full"
      />
      <FormInput
        label={null}
        placeholder="할인율 (%)"
        value={discount.rate * 100 || ''}
        min={0}
        max={100}
        onChange={(value) => handleRateChange(value)}
        className="w-full"
      />
      <TextButton variant="add" title="할인 추가" fullWidth onClick={handleSubmit} />
    </div>
  );
}
