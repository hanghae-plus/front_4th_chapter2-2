import { CartItem } from "../../../types";
import Button from "../common/Button";

interface CartProductCardProps {
  item: CartItem;
  appliedDiscount: number;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;
}

const CartProductCard = ({
  item,
  appliedDiscount,
  updateQuantity,
  removeFromCart,
}: CartProductCardProps) => {
  return (
    <div
      key={item.product.id}
      className="flex justify-between items-center bg-white p-3 rounded shadow"
    >
      <div>
        <span className="font-semibold">{item.product.name}</span>
        <br />
        <span className="text-sm text-gray-600">
          {item.product.price}원 x {item.quantity}
          {appliedDiscount > 0 && (
            <span className="text-green-600 ml-1">
              ({(appliedDiscount * 100).toFixed(0)}% 할인 적용)
            </span>
          )}
        </span>
      </div>

      <div>
        <Button
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
        >
          -
        </Button>
        <Button
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
        >
          +
        </Button>
        <Button
          variant="danger"
          onClick={() => removeFromCart(item.product.id)}
          className="px-2 py-1"
        >
          삭제
        </Button>
      </div>
    </div>
  );
};

export default CartProductCard;
