import { Input } from '../../../shared/ui/inputs';
import { useState } from 'react';
import { IProduct } from '../../../shared/types';
import { Label } from '../../../shared/ui/typography';

interface IProductFormProps {
  onProductAdd: (newProduct: IProduct) => void;
}

export function ProductForm({ onProductAdd }: IProductFormProps): JSX.Element {
  const [newProduct, setNewProduct] = useState<Omit<IProduct, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });
  const [showNewProductForm, setShowNewProductForm] = useState(false);

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
    <>
      <button
        onClick={() => setShowNewProductForm(!showNewProductForm)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
      >
        {showNewProductForm ? '취소' : '새 상품 추가'}
      </button>
      {showNewProductForm && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
          <div className="mb-2">
            <Label
              htmlFor="productName"
              className={'text-sm font-medium text-gray-700'}
            >
              상품명
            </Label>
            <Input
              id={'productName'}
              type={'text'}
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
          </div>
          <div className="mb-2">
            <Label
              htmlFor="productPrice"
              className={'text-sm font-medium text-gray-700'}
            >
              가격
            </Label>
            <Input
              id={'productPrice'}
              type={'number'}
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  price: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="mb-2">
            <Label
              htmlFor="productStock"
              className={'text-sm font-medium text-gray-700'}
            >
              재고
            </Label>
            <Input
              id={'productStock'}
              type={'number'}
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  stock: parseInt(e.target.value),
                })
              }
            />
          </div>
          <button
            onClick={handleAddNewProduct}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            추가
          </button>
        </div>
      )}
    </>
  );
}
