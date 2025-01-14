import Button from "../../common/Button";
import Input from "../../common/Input";

interface ProductSearchProps {
  onChange: (value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  keyword?: string;
}

const ProductSearch = ({
  keyword = "",
  onChange,
  onSubmit,
  onReset,
}: ProductSearchProps) => {
  return (
    <div className="flex gap-4 mb-4">
      <Input
        value={keyword}
        className="flex-1"
        onChange={(e) => onChange(e.target.value)}
        placeholder="상품명을 검색하세요."
      />
      <Button onClick={onSubmit}>검색</Button>
      <Button variant="secondary" onClick={onReset}>
        초기화
      </Button>
    </div>
  );
};

export default ProductSearch;
