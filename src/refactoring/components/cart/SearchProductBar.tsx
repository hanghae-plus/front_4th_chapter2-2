import type { ChangeEvent } from "react";

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const SearchProductBar = ({ onChange }: Props) => {
  return (
    <div className="mb-3">
      <input
        type="text"
        placeholder="상품을 검색해보세요"
        className="border border-gray-300 rounded-md p-2 w-full"
        onChange={onChange}
      />
    </div>
  );
};
