import { useState } from 'react';
import { useProductStore } from '../../../entities/product/model/useProductStore';
import { useEditProduct } from '../../../hooks/useEditProduct';
import { useForm } from '../../../hooks/useForm';
import Error from '../../../pages/shared/Error';
import { Product } from '../../../shared/types/types';
import { getUniqueId } from '../../../pages/shared/lib/getUniqueId';

interface ProductEditFormProps {
  product: Product;
}

function ProductEditForm(props: ProductEditFormProps) {
  const { product } = props;

  const { products, updateProduct } = useProductStore();

  const {
    editingProduct,
    selectEditProduct,
    updateEditingProduct,
    resetEditingProduct,
  } = useEditProduct({ products, updateProduct });

  const [tempDiscount, setTempDiscount] = useState({ quantity: 0, rate: 0 });

  const handleAddDiscount = () => {
    if (tempDiscount.quantity >= 0 && tempDiscount.rate >= 0) {
      const newDiscount = { ...tempDiscount, id: getUniqueId() };
      setValue('discounts', [...values.discounts, newDiscount]);
      setTempDiscount({ quantity: 0, rate: 0 });
    }
  };

  const haldleRemoveDiscount = (id: string) => {
    setValue(
      'discounts',
      values.discounts.filter((discount) => discount.id !== id),
    );
  };

  const onSubmit = (product: Product) => {
    updateEditingProduct(product);
    resetEditingProduct();
  };

  const { values, errors, handleChange, handleSubmit, setValue } =
    useForm<Product>({
      initialValues: {
        ...product,
      },
      onSubmit,
      validate: (values) => {
        const errors: Partial<Record<keyof Product, string>> = {};
        if (!values.name) errors.name = '상품명을 입력하세요.';
        if (values.price <= 0) errors.price = '가격은 0보다 커야 합니다.';
        if (values.stock < 0) errors.stock = '재고는 음수일 수 없습니다.';
        return errors;
      },
    });

  return (
    <div className="mt-2">
      {editingProduct && editingProduct.id === product.id ? (
        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <label className="block mb-1">상품명:</label>
              <input
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              {errors.name && <Error message={errors.name} />}
            </div>
            <div>
              <label className="block mb-1">가격:</label>
              <input
                type="number"
                name="price"
                value={values.price}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              {errors.price && <Error message={errors.price} />}
            </div>
            <div>
              <label className="block mb-1">재고:</label>
              <input
                type="number"
                name="stock"
                value={values.stock}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              {errors.stock && <Error message={errors.stock} />}
            </div>
            {/* 할인 정보 수정 부분 */}
            <div>
              <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
              {values.discounts.map((discount, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-2"
                >
                  <span>
                    {discount.quantity}개 이상 구매 시 {discount.rate * 100}%
                    할인
                  </span>
                  <button
                    type="button"
                    onClick={() => haldleRemoveDiscount(discount.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    삭제
                  </button>
                </div>
              ))}
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="수량"
                  value={tempDiscount.quantity}
                  onChange={(e) =>
                    setTempDiscount({
                      ...tempDiscount,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-1/3 p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="할인율 (%)"
                  value={tempDiscount.rate * 100}
                  onChange={(e) =>
                    setTempDiscount({
                      ...tempDiscount,
                      rate: parseInt(e.target.value) / 100 || 0,
                    })
                  }
                  className="w-1/3 p-2 border rounded"
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
            <button
              type="submit"
              data-testid="modify-completed-button"
              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
            >
              수정 완료
            </button>
          </div>
        </form>
      ) : (
        <div>
          {product.discounts.map((discount, index) => (
            <div key={index} className="mb-2">
              <span>
                {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
              </span>
            </div>
          ))}
          <button
            data-testid="modify-button"
            onClick={() => {
              selectEditProduct(product);
            }}
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
          >
            수정
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductEditForm;
