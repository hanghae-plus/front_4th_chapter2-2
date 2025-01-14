import { Discount, Product } from '../../types.ts';
import { ChangeEvent } from 'react';

interface AdminProductContentProps {
  product: Product;
  // Edit
  editingProduct: Product | null;
  handleEditProduct: (product: Product) => void;
  handleProductNameUpdate: (id: string, name: string) => void;
  handlePriceUpdate: (id: string, price: number) => void;
  handleStockUpdate: (id: string, stock: number) => void;
  handleAddDiscount: (id: string) => void;
  handleRemoveDiscount: (id: string, index: number) => void;
  handleEditComplete: () => void;
  // Discount
  newDiscount: Discount;
  handleChangeQuantity: (event: ChangeEvent<HTMLInputElement>) => void;
  handleChangeRate: (event: ChangeEvent<HTMLInputElement>) => void;
}

const AdminProductContent = ({
  product,
  newDiscount,
  editingProduct,
  handleProductNameUpdate,
  handleEditProduct,
  handlePriceUpdate,
  handleStockUpdate,
  handleAddDiscount,
  handleRemoveDiscount,
  handleEditComplete,
  handleChangeQuantity,
  handleChangeRate,
}: AdminProductContentProps) => (
  <div className='mt-2'>
    {editingProduct && editingProduct.id === product.id ? (
      <div>
        <div className='mb-4'>
          <label className='block mb-1'>상품명: </label>
          <input
            type='text'
            value={editingProduct.name}
            onChange={(e) => handleProductNameUpdate(product.id, e.target.value)}
            className='w-full p-2 border rounded'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>가격: </label>
          <input
            type='number'
            value={editingProduct.price}
            onChange={(e) => handlePriceUpdate(product.id, parseInt(e.target.value))}
            className='w-full p-2 border rounded'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>재고: </label>
          <input
            type='number'
            value={editingProduct.stock}
            onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value))}
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
                onClick={() => handleRemoveDiscount(product.id, index)}
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
              onChange={handleChangeQuantity}
              className='w-1/3 p-2 border rounded'
            />
            <input
              type='number'
              placeholder='할인율 (%)'
              value={newDiscount.rate * 100}
              onChange={handleChangeRate}
              className='w-1/3 p-2 border rounded'
            />
            <button
              onClick={() => handleAddDiscount(product.id)}
              className='w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
            >
              할인 추가
            </button>
          </div>
        </div>
        <button
          onClick={handleEditComplete}
          className='bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2'
        >
          수정 완료
        </button>
      </div>
    ) : (
      <div>
        {product.discounts.map((discount, index) => (
          <div key={index} className='mb-2'>
            <span>
              {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
            </span>
          </div>
        ))}
        <button
          data-testid='modify-button'
          onClick={() => handleEditProduct(product)}
          className='bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2'
        >
          수정
        </button>
      </div>
    )}
  </div>
);

export default AdminProductContent;
