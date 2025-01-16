import { ProductListProps } from "../../../types";
import { useSearch } from "../../hooks/useSearch";

export const ProductList = ({ products, addToCart, getRemainingStock, getMaxDiscount }: ProductListProps) => {

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(products, "name");

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
      {/* 검색 입력창 */}
      <input 
        type="text"
        data-testid="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="w-full mb-4 p-2 border rounded"
      />
      <div className="space-y-2">
        {filteredItems.length > 0 ? (
          filteredItems.map((product) => {
            const remainingStock = getRemainingStock(product);
            
            return (
              <div key={product.id} data-testid={`product-${product.id}`} className="bg-white p-3 rounded shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{product.name}</span>
                  <span className="text-gray-600">{product.price.toLocaleString()}원</span>
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  <span className={`font-medium ${remainingStock > 0 ? "text-green-600" : "text-red-600"}`}>
                    재고: {remainingStock}개
                  </span>
                  {product.discounts.length > 0 && (
                    <span className="ml-2 font-medium text-blue-600">
                      최대 {(getMaxDiscount[product.id] * 100).toFixed(0)}% 할인
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
                    remainingStock > 0
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={remainingStock <= 0}
                >
                  {remainingStock > 0 ? "장바구니에 추가" : "품절"}
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">표시할 상품이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

