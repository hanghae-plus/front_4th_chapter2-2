import { IProduct } from '../../../shared/types';
import { Discount } from './Discount.tsx';
import { DiscountForm } from './DiscountForm.tsx';

interface IDiscountEditProps {
  editingProduct: IProduct;
  setEditingProduct: React.Dispatch<React.SetStateAction<IProduct>>;
}

export function DiscountEdit({
  editingProduct,
  setEditingProduct,
}: IDiscountEditProps) {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
      {editingProduct.discounts.map((discount, index) => (
        <Discount
          key={index}
          discount={discount}
          index={index}
          setEditingProduct={setEditingProduct}
        />
      ))}
      <DiscountForm setEditingProduct={setEditingProduct} />
    </div>
  );
}
