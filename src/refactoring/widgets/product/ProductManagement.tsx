import { useState } from 'react';
import { ProductAddForm } from '../../features/product/ui/ProductAddForm';
import { ProductPanel } from '../../features/product/ui/ProductPanel';
import { useProductContext } from '../../entities/product/model/useProductContext';
import { Product } from '../../../types';

export function ProductManagement() {
  const { products, updateProduct, addProduct } = useProductContext();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAddProduct = (newProduct: Product) => {
    addProduct(newProduct);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const handleEditComplete = () => {
    if (editingProduct) {
      setEditingProduct(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">상품 관리</h2>
      <ProductAddForm onSubmit={handleAddProduct} />
      {products.map((product, index) => {
        const key = `product-${index + 1}`;
        const isEditable = editingProduct && editingProduct.id === product.id;
        return (
          <ProductPanel
            key={key}
            testId={key}
            product={product}
            isEditing={isEditable ?? false}
            onProductUpdate={updateProduct}
            onEdit={handleEditProduct}
            onEditComplete={handleEditComplete}
          />
        );
      })}
    </div>
  );
}
