export interface CouponAddButtonProps {
  onClick: () => void;
}

export const CouponAddButton = ({ onClick }: CouponAddButtonProps) => {
  return (
    <div>
      <button onClick={onClick} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
        쿠폰 추가
      </button>
    </div>
  );
};
