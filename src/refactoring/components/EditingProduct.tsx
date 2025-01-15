import { Discount, Product } from '../../types';

interface Props {
  product: Product;
  productList: Product[];
  editingProduct: Product;
  setEditingProduct: (product: Product | null) => void;
  onProductUpdate: (updatedProduct: Product) => void;
  newDiscount: Discount;
  onDiscountAdd: (productId: string) => void;
  onDiscountRemove: (productId: string, index: number) => void;
  onDiscountUpdate: (newDiscount: Discount) => void;
}
export default function EditingProduct({
  product,
  productList,
  editingProduct,
  setEditingProduct,
  onProductUpdate,
  newDiscount,
  onDiscountAdd,
  onDiscountRemove,
  onDiscountUpdate,
}: Props) {
  const updateStock = (productId: string, newStock: number) => {
    const updatedProduct = productList.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = { ...updatedProduct, stock: newStock };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  };

  // 새로운 핸들러 함수 추가
  const updateProductName = (productId: string, newName: string) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, name: newName };
      setEditingProduct(updatedProduct);
    }
  };

  // 새로운 핸들러 함수 추가
  const updatePrice = (productId: string, newPrice: number) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, price: newPrice };
      setEditingProduct(updatedProduct);
    }
  };

  // 수정 완료 핸들러 함수 추가
  const completeEditing = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      setEditingProduct(null);
    }
  };

  return (
    <div>
      <div className='mb-4'>
        <label className='block mb-1'>상품명: </label>
        <input
          title='상품명'
          type='text'
          value={editingProduct.name}
          onChange={(e) => updateProductName(product.id, e.target.value)}
          className='w-full p-2 border rounded'
        />
      </div>
      <div className='mb-4'>
        <label className='block mb-1'>가격: </label>
        <input
          title='가격'
          type='number'
          value={editingProduct.price}
          onChange={(e) => updatePrice(product.id, parseInt(e.target.value))}
          className='w-full p-2 border rounded'
        />
      </div>
      <div className='mb-4'>
        <label className='block mb-1'>재고: </label>
        <input
          title='재고'
          type='number'
          value={editingProduct.stock}
          onChange={(e) => updateStock(product.id, parseInt(e.target.value))}
          className='w-full p-2 border rounded'
        />
      </div>
      {/* 할인 정보 수정 부분 */}
      <div>
        <h4 className='text-lg font-semibold mb-2'>할인 정보</h4>
        {editingProduct.discounts.map((discount, index) => (
          <div key={index} className='flex justify-between items-center mb-2'>
            <span>
              {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
            </span>
            <button
              onClick={() => onDiscountRemove(product.id, index)}
              className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'
            >
              삭제
            </button>
          </div>
        ))}
        <div className='flex space-x-2'>
          <input
            type='number'
            placeholder='수량'
            value={newDiscount.quantity}
            onChange={(e) =>
              onDiscountUpdate({ ...newDiscount, quantity: parseInt(e.target.value) })
            }
            className='w-1/3 p-2 border rounded'
          />
          <input
            type='number'
            placeholder='할인율 (%)'
            value={newDiscount.rate * 100}
            onChange={(e) =>
              onDiscountUpdate({
                ...newDiscount,
                rate: parseInt(e.target.value) / 100,
              })
            }
            className='w-1/3 p-2 border rounded'
          />
          <button
            onClick={() => onDiscountAdd(product.id)}
            className='w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
          >
            할인 추가
          </button>
        </div>
      </div>
      <button
        onClick={completeEditing}
        className='bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2'
      >
        수정 완료
      </button>
    </div>
  );
}
