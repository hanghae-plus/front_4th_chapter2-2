import { CartItem } from '../../../types.ts';
import { useCart } from '../../hooks/index.ts'

interface Props {
  item: CartItem;
} 

export const CartProduct = ({item}: Props) => {
  const { 
    removeFromCart, 
    updateQuantity,
    getAppliedDiscount
  } = useCart();
    
  return (
    <div key={item.product.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
      <div>
        <span className="font-semibold">{item.product.name}</span>
        <br/>
        <span className="text-sm text-gray-600">
          {item.product.price}원 x {item.quantity}

          {getAppliedDiscount(item) > 0 && (
            <span className="text-green-600 ml-1">
              ({(getAppliedDiscount(item) * 100).toFixed(0)}% 할인 적용)
            </span>
          )}
        </span>
      </div>
      <div>
        <button
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
        >
          -
        </button>
        <button
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
        >
          +
        </button>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          onClick={() => removeFromCart(item.product.id)}
        >
          삭제
        </button>
      </div>
    </div>
  );
}