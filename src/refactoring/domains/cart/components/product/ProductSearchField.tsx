interface ProductSearchFieldProps {
  onSearch: (keyword: string) => void;
}

export const ProductSearchField = ({ onSearch }: ProductSearchFieldProps) => {
  return (
    <div className="flex gap-4 ">
      <input
        className="p-2 w-full rounded"
        placeholder="검색어를 입력하세요..."
        onChange={(event) => onSearch(event.target.value)}
      />
    </div>
  );
};
