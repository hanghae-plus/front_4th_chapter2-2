export interface ProductAddButtonProps {
  onClick: () => void;
}

export const ProductAddButton = ({ onClick }: ProductAddButtonProps) => {
  return (
    <div>
      <button onClick={onClick} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        추가
      </button>
    </div>
  );
};
