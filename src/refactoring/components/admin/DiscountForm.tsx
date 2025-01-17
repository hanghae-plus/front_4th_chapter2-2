import { InputField } from '../InputField';
import { DiscountType } from '../../types';

interface DiscountFormProps {
  productId: string;
  discountList: DiscountType[];
  onAddDiscount: (productId: string, newDiscount: DiscountType) => void;
  onRemoveDiscount: (productId: string, index: number) => void;
  newDiscount: DiscountType;
  setNewDiscount: React.Dispatch<React.SetStateAction<DiscountType>>;
}

export const DiscountForm: React.FC<DiscountFormProps> = ({
  productId,
  discountList,
  onAddDiscount,
  onRemoveDiscount,
  newDiscount,
  setNewDiscount,
}) => (
  <div>
    <h4 className='text-lg font-semibold mb-2'>할인 정보</h4>
    {discountList.map((discount, index) => (
      <div key={index} className='flex justify-between items-center mb-2'>
        <span>
          {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
        </span>
        <button
          onClick={() => onRemoveDiscount(productId, index)}
          className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'
        >
          삭제
        </button>
      </div>
    ))}
    <div className='flex space-x-2'>
      <InputField
        id='discount-quantity'
        placeholder='수량'
        value={newDiscount.quantity || ''}
        type='number'
        onChange={(e) =>
          setNewDiscount({
            ...newDiscount,
            quantity: e.target.value ? parseInt(e.target.value) : 0,
          })
        }
        className='w-1/3 p-2 border rounded'
      />
      <InputField
        id='discount-rate'
        placeholder='할인율 (%)'
        value={newDiscount.rate ? newDiscount.rate * 100 : ''}
        type='number'
        onChange={(e) =>
          setNewDiscount({
            ...newDiscount,
            rate: e.target.value ? parseInt(e.target.value) / 100 : 0,
          })
        }
        className='w-1/3 p-2 border rounded'
      />
      <button
        onClick={() => onAddDiscount(productId, newDiscount)}
        className='w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
      >
        할인 추가
      </button>
    </div>
  </div>
);
