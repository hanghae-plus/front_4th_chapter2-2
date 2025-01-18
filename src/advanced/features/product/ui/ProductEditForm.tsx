import { useState } from 'react';
import { Discount, UpdateProduct } from '@advanced/entities/product';
import { Heading, Input } from '@advanced/shared/ui';
import { useGetProductByIdQuery, useUpdateProductMutation } from '../model';

interface ProductEditFormProps {
  editingProductId: string;
  onSubmit: () => void;
}

export function ProductEditForm({
  editingProductId,
  onSubmit,
}: ProductEditFormProps) {
  const { data: product } = useGetProductByIdQuery(editingProductId);
  const { mutate: updateProduct } = useUpdateProductMutation();
  const [editingProduct, setEditingProduct] = useState(product);
  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0,
  });

  const handleChangeEditingProduct = (
    key: keyof UpdateProduct,
    value: UpdateProduct[keyof UpdateProduct],
  ) => {
    setEditingProduct((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddDiscount = () => {
    setEditingProduct((prev) => ({
      ...prev,
      discounts: [...prev.discounts, newDiscount],
    }));
    setNewDiscount({
      quantity: 0,
      rate: 0,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProduct({ productId: editingProductId, product: editingProduct });
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        labelStyle="simple"
        label="상품명: "
        type="text"
        value={editingProduct.name}
        onChange={(e) => handleChangeEditingProduct('name', e.target.value)}
      />
      <Input
        labelStyle="simple"
        label="가격: "
        type="number"
        value={editingProduct.price}
        onChange={(e) =>
          handleChangeEditingProduct('price', parseInt(e.target.value))
        }
      />
      <Input
        labelStyle="simple"
        label="재고: "
        type="number"
        value={editingProduct.stock}
        onChange={(e) =>
          handleChangeEditingProduct('stock', parseInt(e.target.value))
        }
      />
      {/* 할인 정보 수정 부분 */}
      <div>
        <Heading as="h4" className="text-lg font-semibold mb-2">
          할인 정보
        </Heading>
        {editingProduct.discounts.map((discount, index) => (
          <div key={index} className="flex justify-between items-center mb-2">
            <span>
              {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
            </span>
            <button
              type="button"
              onClick={() =>
                handleChangeEditingProduct(
                  'discounts',
                  editingProduct.discounts.filter((_, i) => i !== index),
                )
              }
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              삭제
            </button>
          </div>
        ))}
        <div className="flex space-x-2">
          <Input
            inputStyle="third"
            type="number"
            placeholder="수량"
            value={newDiscount.quantity}
            onChange={(e) =>
              setNewDiscount({
                ...newDiscount,
                quantity: parseInt(e.target.value),
              })
            }
          />
          <Input
            inputStyle="third"
            type="number"
            placeholder="할인율 (%)"
            value={newDiscount.rate * 100}
            onChange={(e) =>
              setNewDiscount({
                ...newDiscount,
                rate: parseInt(e.target.value) / 100,
              })
            }
          />
          <button
            type="button"
            onClick={handleAddDiscount}
            className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            할인 추가
          </button>
        </div>
      </div>
      <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2">
        수정 완료
      </button>
    </form>
  );
}
