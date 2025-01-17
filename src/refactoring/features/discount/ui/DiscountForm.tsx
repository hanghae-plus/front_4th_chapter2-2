import { Input } from '../../../shared/ui/inputs';
import { useState } from 'react';
import { IDiscount } from '../../../shared/types';
import { useEditingProductContext } from '../../product/model';

export function DiscountForm() {
  const [newDiscount, setNewDiscount] = useState<IDiscount>({
    quantity: 0,
    rate: 0,
  });
  const { handleAddProductDiscount } = useEditingProductContext();

  const handleAddDiscount = () => {
    setNewDiscount({ quantity: 0, rate: 0 });
    handleAddProductDiscount(newDiscount);
  };

  return (
    <div className="flex space-x-2">
      <Input
        type="number"
        placeholder="수량"
        value={newDiscount.quantity}
        onChange={(e) =>
          setNewDiscount({
            ...newDiscount,
            quantity: parseInt(e.target.value),
          })
        }
        size={'sm'}
      />
      <Input
        type="number"
        placeholder="할인율 (%)"
        value={newDiscount.rate * 100}
        onChange={(e) =>
          setNewDiscount({
            ...newDiscount,
            rate: parseInt(e.target.value) / 100,
          })
        }
        size={'sm'}
      />
      <button
        onClick={() => handleAddDiscount()}
        className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        할인 추가
      </button>
    </div>
  );
}
