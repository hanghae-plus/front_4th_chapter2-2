import { Product } from "../../../types"; 

interface Props {
  product: Product;
  addToCart: (product: Product) => void;
  getRemainingStock: (product: Product) => number;
  getMaxDiscount: (discounts: { quantity: number; rate: number }[]) => number;
}

export const CartList = ({ product, addToCart, getRemainingStock, getMaxDiscount }: Props) => {
  return (
    <div key={product.id} data-testid={`product-${product.id}`} className="bg-white p-3 rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{product.name}</span>
        <span className="text-gray-600">{product.price.toLocaleString()}원</span>
      </div>
      <div className="text-sm text-gray-500 mb-2">
        <span className={`font-medium ${getRemainingStock(product) > 0 ? 'text-green-600' : 'text-red-600'}`}>
          재고: {getRemainingStock(product)}개
        </span>
        {product.discounts.length > 0 && (
          <span className="ml-2 font-medium text-blue-600">
            최대 {(getMaxDiscount(product.discounts) * 100).toFixed(0)}% 할인
          </span>
        )}
      </div>
      {product.discounts.length > 0 && (
        <ul className="list-disc list-inside text-sm text-gray-500 mb-2">
          {product.discounts.map((discount, index) => (
            <li key={index}>
              {discount.quantity}개 이상: {(discount.rate * 100).toFixed(0)}% 할인
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => addToCart(product)}
        className={`w-full px-3 py-1 rounded ${
          getRemainingStock(product) > 0
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        disabled={getRemainingStock(product) <= 0}
      >
        {getRemainingStock(product) > 0 ? '장바구니에 추가' : '품절'}
      </button>
    </div>
  );
}