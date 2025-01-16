import { Product } from "../../../types";
import DiscountInfo from "./DiscountInfo";
import ProductPrice from "./ProductPrice";

interface ProductListProps {
  products: Product[];
  addToCart: (product: Product) => void;
  getRemainingStock: (product: Product) => number;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  addToCart,
  getRemainingStock,
}) => {
  return (
    <div className="space-y-2">
      {products.map((product) => {
        const remainingStock = getRemainingStock(product);
        return (
          <div
            key={product.id}
            data-testid={`product-${product.id}`}
            className="bg-white p-3 rounded shadow"
          >
            <ProductPrice product={product} remainingStock={remainingStock} />
            <DiscountInfo product={product} />
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
      })}
    </div>
  );
};

export default ProductList;
