import { useState } from 'react';
import { Discount, Product } from '../../../types.ts';
import { Title } from '../templates/Title.tsx';
import { Button } from '../ui/Button.tsx';
import { Card } from '../ui/Card.tsx';
import { Input } from '../ui/Input.tsx';

type PropsType = {
  products: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
};
export const ProductManageSection = (props: PropsType) => {
  const { products, onProductUpdate, onProductAdd } = props;

  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0,
  });

  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  // handleEditProduct 함수 수정
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
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
    const updatedProduct = products.find(p => p.id === productId);
    if (updatedProduct) {
      const newProduct = { ...updatedProduct, stock: newStock };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  };

  const handleAddDiscount = (productId: string) => {
    const updatedProduct = products.find(p => p.id === productId);
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
    const updatedProduct = products.find(p => p.id === productId);
    if (updatedProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: updatedProduct.discounts.filter((_, i) => i !== index),
      };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
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
    <div>
      <Title level={2}>상품 관리</Title>
      <Button
        variant="green"
        className="px-4 py-2 mb-4"
        onClick={() => setShowNewProductForm(!showNewProductForm)}
      >
        {showNewProductForm ? '취소' : '새 상품 추가'}
      </Button>
      {showNewProductForm && (
        <Card className="mb-4">
          <Title level={3}>새 상품 추가</Title>
          <Input
            id="productName"
            label="상품명"
            value={newProduct.name}
            onChange={e =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <Input
            id="productPrice"
            label="가격"
            type="number"
            value={newProduct.price}
            onChange={e =>
              setNewProduct({
                ...newProduct,
                price: parseInt(e.target.value),
              })
            }
          />
          <Input
            id="productStock"
            label="재고"
            type="number"
            value={newProduct.stock}
            onChange={e =>
              setNewProduct({
                ...newProduct,
                stock: parseInt(e.target.value),
              })
            }
          />
          <Button fullWidth className="p-2" onClick={handleAddNewProduct}>
            추가
          </Button>
        </Card>
      )}
      <div className="space-y-2">
        {products.map((product, index) => (
          <Card key={product.id} testId={`product-${index + 1}`}>
            <Button
              data-testid="toggle-button"
              fullWidth
              variant="none"
              className="text-left font-semibold"
              onClick={() => toggleProductAccordion(product.id)}
            >
              {product.name} - {product.price}원 (재고: {product.stock})
            </Button>
            {openProductIds.has(product.id) && (
              <div className="mt-2">
                {editingProduct && editingProduct.id === product.id ? (
                  <div>
                    <Input
                      label="상품명:"
                      wrapperClassName="mb-4"
                      labelClassName="mb-1 text-base font-medium"
                      value={editingProduct.name}
                      onChange={e =>
                        handleProductNameUpdate(product.id, e.target.value)
                      }
                    />
                    <Input
                      label="가격:"
                      wrapperClassName="mb-4"
                      labelClassName="mb-1 text-base font-medium"
                      type="number"
                      value={editingProduct.price}
                      onChange={e =>
                        handlePriceUpdate(product.id, parseInt(e.target.value))
                      }
                    />
                    <Input
                      label="재고:"
                      wrapperClassName="mb-4"
                      labelClassName="mb-1 text-base font-medium"
                      type="number"
                      value={editingProduct.stock}
                      onChange={e =>
                        handleStockUpdate(product.id, parseInt(e.target.value))
                      }
                    />

                    {/* 할인 정보 수정 부분 */}
                    <div>
                      <Title level={4}>할인 정보</Title>
                      {editingProduct.discounts.map((discount, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center mb-2"
                        >
                          <span>
                            {discount.quantity}개 이상 구매 시{' '}
                            {discount.rate * 100}% 할인
                          </span>
                          <Button
                            variant="danger"
                            onClick={() =>
                              handleRemoveDiscount(product.id, index)
                            }
                          >
                            삭제
                          </Button>
                        </div>
                      ))}
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          placeholder="수량"
                          value={newDiscount.quantity}
                          onChange={e =>
                            setNewDiscount({
                              ...newDiscount,
                              quantity: parseInt(e.target.value),
                            })
                          }
                          className="w-1/3 p-2 border rounded"
                        />
                        <input
                          type="number"
                          placeholder="할인율 (%)"
                          value={newDiscount.rate * 100}
                          onChange={e =>
                            setNewDiscount({
                              ...newDiscount,
                              rate: parseInt(e.target.value) / 100,
                            })
                          }
                          className="w-1/3 p-2 border rounded"
                        />
                        <Button
                          variant="primary"
                          className="w-1/3 p-2"
                          onClick={() => handleAddDiscount(product.id)}
                        >
                          할인 추가
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="green"
                      className="mt-2"
                      onClick={handleEditComplete}
                    >
                      수정 완료
                    </Button>
                  </div>
                ) : (
                  <div>
                    {product.discounts.map((discount, index) => (
                      <div key={index} className="mb-2">
                        <span>
                          {discount.quantity}개 이상 구매 시{' '}
                          {discount.rate * 100}% 할인
                        </span>
                      </div>
                    ))}
                    <Button
                      data-testid="modify-button"
                      className="mt-2"
                      onClick={() => handleEditProduct(product)}
                    >
                      수정
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
