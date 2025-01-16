import { useState } from 'react';
import { CouponType, DiscountType, ProductType } from '../types';
import { AdminPageUI } from './admin/AdminPageUI';
import { updateProductField, handleAddOrRemoveDiscount } from '../utils/product';

interface Props {
  productList: ProductType[];
  couponList: CouponType[];
  onProductUpdate: (updatedProduct: ProductType) => void;
  onProductAdd: (newProduct: ProductType) => void;
  onCouponAdd: (newCoupon: CouponType) => void;
}

export const AdminPage = ({
  productList,
  couponList,
  onProductUpdate,
  onProductAdd,
  onCouponAdd,
}: Props) => {
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
  const [newDiscount, setNewDiscount] = useState<DiscountType>({
    quantity: 0,
    rate: 0,
  });
  const [newCoupon, setNewCoupon] = useState<CouponType>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<ProductType, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleEditProduct = (product: ProductType) => {
    setEditingProduct({ ...product });
  };

  const handleEditComplete = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      setEditingProduct(null);
    }
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    const updatedProduct = productList.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = { ...updatedProduct, stock: newStock };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  };

  const handleAddDiscount = (productId: string) => {
    handleAddOrRemoveDiscount(
      productId,
      newDiscount,
      true,
      productList,
      onProductUpdate,
      setEditingProduct,
    );
    setNewDiscount({ quantity: 0, rate: 0 });
  };

  const handleRemoveDiscount = (productId: string, index: number) => {
    const discountToRemove = productList.find((p) => p.id === productId)?.discounts[index];
    if (discountToRemove) {
      handleAddOrRemoveDiscount(
        productId,
        discountToRemove,
        false,
        productList,
        onProductUpdate,
        setEditingProduct,
      );
    }
  };

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
    });
  };

  const handleAddNewProduct = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() };

    onProductAdd(productWithId);
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    });

    setShowNewProductForm(false);
  };

  return (
    <AdminPageUI
      productList={productList}
      couponList={couponList}
      openProductIds={openProductIds}
      editingProduct={editingProduct}
      newDiscount={newDiscount}
      newCoupon={newCoupon}
      showNewProductForm={showNewProductForm}
      newProduct={newProduct}
      setNewProduct={setNewProduct}
      setShowNewProductForm={setShowNewProductForm}
      setNewDiscount={setNewDiscount}
      setNewCoupon={setNewCoupon}
      handleProductNameUpdate={(productId, newName) =>
        updateProductField(productId, 'name', newName, editingProduct, setEditingProduct)
      }
      handlePriceUpdate={(productId, newPrice) =>
        updateProductField(productId, 'price', newPrice, editingProduct, setEditingProduct)
      }
      handleStockUpdate={handleStockUpdate}
      handleAddDiscount={handleAddDiscount}
      handleRemoveDiscount={handleRemoveDiscount}
      handleAddCoupon={handleAddCoupon}
      handleAddNewProduct={handleAddNewProduct}
      toggleProductAccordion={toggleProductAccordion}
      handleEditProduct={handleEditProduct}
      handleEditComplete={handleEditComplete}
    />
  );
};
