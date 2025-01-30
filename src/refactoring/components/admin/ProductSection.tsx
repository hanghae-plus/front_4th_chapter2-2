import { Button, Input } from "../shared";
import React, { useState } from "react";
import { useProducts } from "../../hooks";
import { initialProducts } from "../../../store/globalStore.ts";
import { Discount, Product } from "../../../types.ts";

interface Props {
  products: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
}

const ProductSection = ({ products, onProductUpdate, onProductAdd }: Props) => {
  const {
    openProductIds,
    toggleProductAccordion,
    editingProduct,
    handleEditProduct,
  } = useProducts(initialProducts);
  // 상품관리 > 상품 클릭 시 상세정보 폼
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  // 쿠폰 관리
  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0,
  });

  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    stock: 0,
    discounts: [],
  });

  // 새로운 핸들러 함수 추가
  const handleProductNameUpdate = (productId: string, newName: string) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, name: newName };
      handleEditProduct(updatedProduct);
    }
  };

  // 새로운 핸들러 함수 추가
  const handlePriceUpdate = (productId: string, newPrice: number) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, price: newPrice };
      handleEditProduct(updatedProduct);
    }
  };

  // 수정 완료 핸들러 함수 추가
  const handleEditComplete = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      handleEditProduct(null);
    }
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = { ...updatedProduct, stock: newStock };
      onProductUpdate(newProduct);
      handleEditProduct(newProduct);
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
      handleEditProduct(newProduct);
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
      handleEditProduct(newProduct);
    }
  };

  const handleAddNewProduct = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    onProductAdd(productWithId);
    setNewProduct({
      name: "",
      price: 0,
      stock: 0,
      discounts: [],
    });
    setShowNewProductForm(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
      <Button
        onClick={() => setShowNewProductForm(!showNewProductForm)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
      >
        {showNewProductForm ? "취소" : "새 상품 추가"}
      </Button>
      {showNewProductForm && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
          <div className="mb-2">
            <Input
              label="상품명"
              labelType="newItem"
              id="productName"
              type="text"
              value={newProduct.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
          </div>
          <div className="mb-2">
            <Input
              label="가격"
              labelType="newItem"
              id="productPrice"
              value={newProduct.price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewProduct({
                  ...newProduct,
                  price: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="mb-2">
            <Input
              label="재고"
              labelType="newItem"
              id="productStock"
              value={newProduct.stock}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewProduct({
                  ...newProduct,
                  stock: parseInt(e.target.value),
                })
              }
            />
          </div>
          <Button onClick={handleAddNewProduct}>추가</Button>
        </div>
      )}
      <div className="space-y-2">
        {products.map((product, index) => (
          <div
            key={product.id}
            data-testid={`product-${index + 1}`}
            className="bg-white p-4 rounded shadow"
          >
            <Button
              onClick={() => toggleProductAccordion(product.id)}
              data={{ testId: "toggle-button" }}
              className="w-full text-left font-semibold"
            >
              {product.name} - {product.price}원 (재고: {product.stock})
            </Button>
            {openProductIds.has(product.id) && (
              <div className="mt-2">
                {editingProduct && editingProduct.id === product.id ? (
                  <div>
                    <div className="mb-4">
                      <Input
                        label="상품명: "
                        labelType="editItem"
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) =>
                          handleProductNameUpdate(product.id, e.target.value)
                        }
                      />
                    </div>
                    <div className="mb-4">
                      <Input
                        label="가격: "
                        labelType="editItem"
                        value={editingProduct.price}
                        onChange={(e) =>
                          handlePriceUpdate(
                            product.id,
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div className="mb-4">
                      <Input
                        label="재고: "
                        labelType="editItem"
                        value={editingProduct.stock}
                        onChange={(e) =>
                          handleStockUpdate(
                            product.id,
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                    {/* 할인 정보 수정 부분 */}
                    <div>
                      <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
                      {editingProduct.discounts.map((discount, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center mb-2"
                        >
                          <span>
                            {discount.quantity}개 이상 구매 시{" "}
                            {discount.rate * 100}% 할인
                          </span>
                          <Button
                            onClick={() =>
                              handleRemoveDiscount(product.id, index)
                            }
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          >
                            삭제
                          </Button>
                        </div>
                      ))}
                      <div className="flex space-x-2">
                        <Input
                          placeholder="수량"
                          value={newDiscount.quantity}
                          onChange={(e) =>
                            setNewDiscount({
                              ...newDiscount,
                              quantity: parseInt(e.target.value),
                            })
                          }
                          size="small"
                        />
                        <Input
                          placeholder="할인율 (%)"
                          value={newDiscount.rate * 100}
                          onChange={(e) =>
                            setNewDiscount({
                              ...newDiscount,
                              rate: parseInt(e.target.value) / 100,
                            })
                          }
                          size="small"
                        />
                        <Button
                          onClick={() => handleAddDiscount(product.id)}
                          className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                          할인 추가
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={handleEditComplete}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
                    >
                      수정 완료
                    </Button>
                  </div>
                ) : (
                  <div>
                    {product.discounts.map((discount, index) => (
                      <div key={index} className="mb-2">
                        <span>
                          {discount.quantity}개 이상 구매 시{" "}
                          {discount.rate * 100}% 할인
                        </span>
                      </div>
                    ))}
                    <Button
                      onClick={() => handleEditProduct(product)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
                      data={{ testId: "modify-button" }}
                    >
                      수정
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
