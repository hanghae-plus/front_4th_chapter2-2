import { useState } from 'react';
import { ProductDisplay } from '../../../entities/product/ui/ProductDisplay';
import { Product } from '../../../../types';
import { PanelTrigger } from '../../../entities/product/ui/PanelTrigger';
import { ProductEditForm } from './ProductEditForm';
import { DiscountCondition } from '../../../entities/discount/ui/DiscountCondition';
import { TextButton } from '../../../shared/ui';

interface ProductPanelProps {
  product: Product;
  testId?: string;
  isEditing: boolean;
  className?: string;
  onProductUpdate: (product: Product) => void;
  onEdit: (product: Product) => void;
  onEditComplete: () => void;
}

export function ProductPanel({
  product,
  className = '',
  testId = `product-${product.id}`,
  isEditing,
  onProductUpdate,
  onEdit,
  onEditComplete,
}: ProductPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleSubmit = (editingProduct: Product) => {
    onProductUpdate(editingProduct);
    onEditComplete();
  };

  return (
    <ProductDisplay testId={testId} product={product} className={className}>
      <PanelTrigger onToggle={handleToggle}>
        {product.name} - {product.price}원 (재고: {product.stock})
      </PanelTrigger>
      {isOpen &&
        (isEditing ? (
          <ProductEditForm product={product} onUpdate={handleSubmit} />
        ) : (
          <div>
            <DiscountCondition discounts={product.discounts} variant="plain" />
            <TextButton
              testId="modify-button"
              variant="add"
              title="수정"
              onClick={() => onEdit(product)}
              className="px-2 py-1"
            />
          </div>
        ))}
      {/* </div> */}
    </ProductDisplay>
  );
}
