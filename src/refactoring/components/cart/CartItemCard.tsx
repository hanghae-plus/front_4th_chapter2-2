import { memo } from "react";
import { CartItem } from "../../../types";

const CartItemCard = ({
  item,
  appliedDiscount,
  onUpdateQuantity,
  onRemoveFromCart,
}: {
  item: CartItem;
  appliedDiscount: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveFromCart: (id: string) => void;
}) => {
  const { product, quantity } = item;
  const { id, name, price } = product;

  return (
    <div className="flex justify-between items-center bg-white p-3 rounded shadow">
      <div>
        <span className="font-semibold">{name}</span>
        <br />
        <span className="text-sm text-gray-600">
          {price}원 x {quantity}
          {appliedDiscount > 0 && (
            <span className="text-green-600 ml-1">
              ({(appliedDiscount * 100).toFixed(0)}% 할인 적용)
            </span>
          )}
        </span>
      </div>

      <div>
        <button
          onClick={() => onUpdateQuantity(id, quantity - 1)}
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
        >
          -
        </button>
        <button
          onClick={() => onUpdateQuantity(id, quantity + 1)}
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
        >
          +
        </button>
        <button
          onClick={() => onRemoveFromCart(id)}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default memo(CartItemCard);
