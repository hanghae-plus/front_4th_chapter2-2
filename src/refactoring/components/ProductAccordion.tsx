import { useState } from "react";
import { Discount, Product } from "../../types";
import { ProductEditForm } from "./ProductEditForm";
import { toggleProductInSet } from "../models/product";
import { ProductDiscounts } from "./ProductDiscounts";

interface Props {
  product: Product;
  index: number;
  products: Product[];
  onProductAdd: (newProduct: Product) => void;
  onProductUpdate: (updatedProduct: Product) => void;
}

export const ProductAccordion = ({
  product,
  products,
  index,
  onProductUpdate,
}: Props) => {
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0,
  });

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => toggleProductInSet(prev, productId));
  };

  // 새로운 핸들러 함수 추가
  const handleProductNameUpdate = (productId: string, newName: string) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, name: newName };
      setEditingProduct(updatedProduct);
    }
  };

  // 새로운 핸들러 함수 추가
  const handlePriceUpdate = (productId: string, newPrice: number) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, price: newPrice };
      setEditingProduct(updatedProduct);
    }
  };

  // 수정 완료 핸들러 함수 추가
  const handleEditComplete = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      setEditingProduct(null);
    }
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = { ...updatedProduct, stock: newStock };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  };

  const handleAddDiscount = (productId: string) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct && editingProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: [...updatedProduct.discounts, newDiscount],
      };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
      setNewDiscount({ quantity: 0, rate: 0 });
    }
  };

  const handleRemoveDiscount = (productId: string, index: number) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: updatedProduct.discounts.filter((_, i) => i !== index),
      };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  };

  // handleEditProduct 함수 수정
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  return (
    <div
      key={product.id}
      data-testid={`product-${index + 1}`}
      className="bg-white p-4 rounded shadow"
    >
      <button
        data-testid="toggle-button"
        onClick={() => toggleProductAccordion(product.id)}
        className="w-full text-left font-semibold"
      >
        {product.name} - {product.price}원 (재고: {product.stock})
      </button>
      {openProductIds.has(product.id) && (
        <div className="mt-2">
          {editingProduct && editingProduct.id === product.id ? (
            <ProductEditForm
              editingProduct={editingProduct}
              productId={product.id}
              onProductNameUpdate={handleProductNameUpdate}
              onDiscountAdd={handleAddDiscount}
              onEditComplete={handleEditComplete}
              onNewDiscountSet={(newDiscount) => setNewDiscount(newDiscount)}
              onProductPriceUpdate={handlePriceUpdate}
              onRemoveDiscount={handleRemoveDiscount}
              onStockUpdate={handleStockUpdate}
              newDiscount={newDiscount}
            />
          ) : (
            <div>
              {product.discounts.map((discount, index) => (
                <ProductDiscounts key={index} discount={discount} />
              ))}
              <button
                data-testid="modify-button"
                onClick={() => handleEditProduct(product)}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
              >
                수정
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
