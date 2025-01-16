interface ProductSearchProps {
  searchQuery: string;
  priceRange: {
    min?: number;
    max?: number;
  };

  handleSearch: (query: string) => void;
  handlePriceRange: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "min" | "max"
  ) => void;
}

function ProductSearch(props: ProductSearchProps) {
  const { searchQuery, priceRange, handleSearch, handlePriceRange } = props;

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-semibold mb-4">상품 검색</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="상품명 검색..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="최소 가격"
            value={priceRange.min || ""}
            onChange={(e) => handlePriceRange(e, "min")}
            className="w-32 px-3 py-2 border rounded-md"
          />
          <span className="self-center">~</span>
          <input
            type="number"
            placeholder="최대 가격"
            value={priceRange.max || ""}
            onChange={(e) => handlePriceRange(e, "max")}
            className="w-32 px-3 py-2 border rounded-md"
          />
        </div>
      </div>
    </div>
  );
}

export default ProductSearch;
