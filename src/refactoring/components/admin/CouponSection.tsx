import { Button, Input } from "../shared";
import { useState } from "react";
import { Coupon } from "../../../types.ts";
import { useCoupons } from "../../hooks";
import { initialCoupons } from "../../../store/globalStore.ts";

const CouponSection = () => {
  const { coupons, addCoupon } = useCoupons(initialCoupons);

  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: "",
    code: "",
    discountType: "percentage",
    discountValue: 0,
  });

  const CurrentCouponList = () => {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
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

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
      <div className="bg-white p-4 rounded shadow">
        <div className="space-y-2 mb-4">
          <Input
            type="text"
            placeholder="쿠폰 이름"
            value={newCoupon.name}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, name: e.target.value })
            }
          />
          <Input
            type="text"
            placeholder="쿠폰 코드"
            value={newCoupon.code}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, code: e.target.value })
            }
          />
          <div className="flex gap-2">
            <select
              value={newCoupon.discountType}
              onChange={(e) =>
                setNewCoupon({
                  ...newCoupon,
                  discountType: e.target.value as "amount" | "percentage",
                })
              }
              className="w-full p-2 border rounded"
            >
              <option value="amount">금액(원)</option>
              <option value="percentage">할인율(%)</option>
            </select>
            <Input
              placeholder="할인 값"
              value={newCoupon.discountValue}
              onChange={(e) =>
                setNewCoupon({
                  ...newCoupon,
                  discountValue: parseInt(e.target.value),
                })
              }
            />
          </div>
          <Button
            onClick={() => addCoupon(newCoupon)}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            쿠폰 추가
          </Button>
        </div>
        <CurrentCouponList />
      </div>
    </div>
  );
};

export default CouponSection;
