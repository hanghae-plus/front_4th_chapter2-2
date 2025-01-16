import { DiscountFormProps } from '../type/cart.type';

export const DiscountForm = ({
  newDiscount,
  onNewDiscountChange,
  onAddDiscount,
}: DiscountFormProps) => (
  <div className='flex space-x-2'>
    <input
      type='number'
      value={newDiscount.quantity}
      onChange={(e) =>
        onNewDiscountChange({
          ...newDiscount,
          quantity: parseInt(e.target.value),
        })
      }
      placeholder='수량'
      className='w-1/3 p-2 border rounded'
    />
    <input
      type='number'
      value={newDiscount.rate}
      onChange={(e) =>
        onNewDiscountChange({
          ...newDiscount,
          rate: parseFloat(e.target.value),
        })
      }
      placeholder='할인율'
      className='w-1/3 p-2 border rounded'
    />
    <button
      onClick={onAddDiscount}
      className='w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
    >
      추가
    </button>
  </div>
);
