import { useState } from 'react';
import { Product } from '../../types';
import {
  INITIAL_DISCOUNT_STATE,
  INITIAL_PRODUCT_STATE,
} from '../data/initialData';
import {
  checkProduct,
  updateProductNewDiscount,
  removeProductDiscount,
  addNewProduct,
} from '../models';

interface Props {
  products: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onAddSuccess?: () => void;
}

export const useAdminProduct = ({
  products,
  onProductUpdate,
  onProductAdd,
  onAddSuccess,
}: Props) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newDiscount, setNewDiscount] = useState(INITIAL_DISCOUNT_STATE);
  const [newProduct, setNewProduct] = useState(INITIAL_PRODUCT_STATE);

  // 상품 수정 핸들러 함수
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  // 상품 이름 수정 핸들러 함수
  const handleProductNameUpdate = (productId: string, newName: string) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, name: newName };

      setEditingProduct(updatedProduct);
    }
  };

  // 상품 가격 수정 핸들러 함수
  const handlePriceUpdate = (productId: string, newPrice: number) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, price: newPrice };

      setEditingProduct(updatedProduct);
    }
  };

  // 상품 수정 완료 핸들러 함수
  const handleEditComplete = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      setEditingProduct(null);
    }
  };

  // 상품 재고 수정 핸들러 함수
  const handleStockUpdate = (productId: string, newStock: number) => {
    const updatedProduct = checkProduct(products, productId);
    if (updatedProduct) {
      const newProduct = { ...updatedProduct, stock: newStock };

      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  };

  // 상품
  const handleAddDiscount = (productId: string) => {
    const updatedProduct = checkProduct(products, productId);
    if (updatedProduct && editingProduct) {
      const newProduct = updateProductNewDiscount(updatedProduct, newDiscount);

      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
      setNewDiscount({ quantity: 0, rate: 0 });
    }
  };

  const handleRemoveDiscount = (productId: string, index: number) => {
    const updatedProduct = checkProduct(products, productId);
    if (updatedProduct) {
      const newProduct = removeProductDiscount(updatedProduct, index);

      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  };

  const handleAddNewProduct = () => {
    const productWithId = addNewProduct(newProduct);

    onProductAdd(productWithId);
    setNewProduct(INITIAL_PRODUCT_STATE);
    onAddSuccess?.();
  };

  return {
    editingProduct,
    handleEditProduct,
    handleProductNameUpdate,
    handlePriceUpdate,
    handleEditComplete,
    handleStockUpdate,
    handleAddDiscount,
    handleRemoveDiscount,
    newDiscount,
    setNewDiscount,
    newProduct,
    setNewProduct,
    handleAddNewProduct,
  };
};
