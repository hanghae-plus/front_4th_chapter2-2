import { Product } from '../../../../types';
import { TextButton, FormInput } from '../../../shared/ui';
import { DiscountEditor } from '../../discount/ui/DiscountEditor';
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
        id="name-input"
        label="상품명: "
        type="text"
        value={editingProduct.name}
        onChange={(value) => handleFieldChange('name', value)}
      />
      <FormInput
        id="price-input"
        label="가격: "
        value={editingProduct.price}
        onChange={(value) => handleFieldChange('price', value)}
      />
      <FormInput
        id="stock-input"
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
