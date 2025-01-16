import { Product } from '../../../../types';
import { TextButton } from '../../../shared/ui';
import { DiscountEditor } from '../../discount/ui/DiscountEditor';
import { FormInput } from '../../../shared/ui/FormInput';
import { useProductEditForm } from '../model/useProductEditForm';

export interface ProductEditFormProps {
  product: Product;
  onUpdate: (updatedProduct: Product) => void;
}

export function ProductEditForm({ product, onUpdate }: ProductEditFormProps) {
  const { editingProduct, handleFieldChange, handleDiscountUpdate, handleSubmit } =
    useProductEditForm({
      product,
      onUpdate,
    });
  return (
    <div>
      <FormInput
        label="상품명: "
        type="text"
        value={editingProduct.name}
        onChange={(value) => handleFieldChange('name', value)}
      />
      <FormInput
        label="가격: "
        value={editingProduct.price}
        onChange={(value) => handleFieldChange('price', value)}
      />
      <FormInput
        label="재고: "
        value={editingProduct.stock}
        onChange={(value) => handleFieldChange('stock', value)}
      />
      <DiscountEditor initialDiscounts={editingProduct.discounts} onUpdate={handleDiscountUpdate} />
      <TextButton
        variant="complete"
        title="수정 완료"
        className="px-2 py-1"
        onClick={handleSubmit}
      />
    </div>
  );
}
