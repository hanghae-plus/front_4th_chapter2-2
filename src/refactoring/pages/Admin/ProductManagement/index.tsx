import { ProductAddForm } from '@/refactoring/pages/Admin/ProductManagement/components/ProductAddForm';
import { ProductEditor } from '@/refactoring/pages/Admin/ProductManagement/components/ProductEditor';
import type { Product } from '@/types';

interface ProductManagementProps {
  products: Product[];
  onProductAdd: (newProduct: Product) => void;
  onProductUpdate: (updatedProduct: Product) => void;
}

export const ProductManagement = ({ products, onProductAdd, onProductUpdate }: ProductManagementProps) => {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">상품 관리</h2>

      <ProductAddForm onProductAdd={onProductAdd} />

      <div className="space-y-2">
        {products.map((product, index) => (
          <ProductEditor key={product.id} product={product} testId={`${index + 1}`} onProductUpdate={onProductUpdate} />
        ))}
      </div>
    </div>
  );
};
