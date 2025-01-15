import { AddProduct } from '@/refactoring/pages/Admin/ProductManagement/AddProduct/AddProduct';
import { UpdateProduct } from '@/refactoring/pages/Admin/ProductManagement/UpdateProduct/UpdateProduct';
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

      <AddProduct onProductAdd={onProductAdd} />
      <div className="space-y-2">
        {products.map((product, index) => (
          <UpdateProduct product={product} testId={`${index + 1}`} onProductUpdate={onProductUpdate} />
        ))}
      </div>
    </div>
  );
};
