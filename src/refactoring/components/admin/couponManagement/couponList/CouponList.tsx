import { useCoupons } from "../../../../hooks";
import Title from "../../../atoms/Title";

export const CouponList = () => {
  const { coupons } = useCoupons();
  return (
    <div>
      <Title level={3} text="현재 쿠폰 목록" size={"lg"} />
      <div className="space-y-2">
        {coupons.map((coupon, index) => (
          <div
            key={index}
            data-testid={`coupon-${index + 1}`}
            className="bg-gray-100 p-2 rounded"
          >
            {coupon.name} ({coupon.code}):
            {coupon.discountType === "amount"
              ? `${coupon.discountValue}원`
              : `${coupon.discountValue}%`}{" "}
            할인
          </div>
        ))}
      </div>
    </div>
  );
};
