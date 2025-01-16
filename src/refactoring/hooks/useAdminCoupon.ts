import { useState } from "react";
import { Coupon } from "../../types";

interface Props {
  onCouponAdd: (newCoupon: Coupon) => void;
}

function useAdminCoupon({ onCouponAdd }: Props) {
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: "",
    code: "",
    discountType: "percentage",
    discountValue: 0,
  });

  // 쿠폰 추가 핸들러
  const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon({
      name: "",
      code: "",
      discountType: "percentage",
      discountValue: 0,
    });
  };

  return { newCoupon, setNewCoupon, handleAddCoupon };
}

export default useAdminCoupon;
