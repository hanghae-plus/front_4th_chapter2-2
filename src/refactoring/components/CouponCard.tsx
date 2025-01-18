import { Coupon } from "../../types";

interface Props {
  index: number;
  coupon: Coupon;
}

export const CouponCard = ({ index, coupon }: Props) => {
  return (
    <div
      data-testid={`coupon-${index + 1}`}
      className="bg-gray-100 p-2 rounded"
    >
      {coupon.name} ({coupon.code}):
      {coupon.discountType === "amount"
        ? `${coupon.discountValue}원`
        : `${coupon.discountValue}%`}{" "}
      할인
    </div>
  );
};
