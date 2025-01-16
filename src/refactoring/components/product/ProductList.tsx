import { CartItem, Product } from "../../../types";
import { useProductSearch } from "../../hooks/useProductSearch";
import ProductItem from "./ProductItem";
import ProductSearch from "./ProductSearch";

interface ProductListProps {
  products: Product[];
  addToCart: (product: Product) => void;
  cart: CartItem[];
}

function ProductList(props: ProductListProps) {
  const { products, addToCart, cart } = props;
  const {
    searchQuery,
    priceRange,
    filteredProducts,
    handleSearch,
    handlePriceRange,
  } = useProductSearch(products);

  return (
    <div className="flex flex-col gap-4">
      <ProductSearch
        searchQuery={searchQuery}
        priceRange={priceRange}
        handleSearch={handleSearch}
        handlePriceRange={handlePriceRange}
      />
      <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
      <div className="space-y-2">
        {filteredProducts.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            addToCart={addToCart}
            cart={cart}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
