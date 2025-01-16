import { Coupon } from "../../types";

interface ValidationErrors {
  name?: string;
  code?: string;
  discountType?: string;
  discountValue?: string;
}

/**
 * 쿠폰 추가 시 유효성 검사
 * @param newCoupon 쿠폰 정보
 * @returns 유효성 검사 결과
 */
function validateCoupon(newCoupon: Coupon): ValidationErrors {
  const newErrors: ValidationErrors = {};

  if (!newCoupon.name.trim()) {
    newErrors.name = "쿠폰 이름을 입력해주세요";
  } else if (newCoupon.name.length > 50) {
    newErrors.name = "쿠폰 이름은 50자 이내로 입력해주세요";
  }

  if (!newCoupon.code.trim()) {
    newErrors.code = "쿠폰 코드를 입력해주세요";
  } else if (newCoupon.code.length > 10) {
    newErrors.code = "쿠폰 코드는 10자 이내로 입력해주세요";
  }

  if (!newCoupon.discountType) {
    newErrors.discountType = "할인 유형을 선택해주세요";
  }

  if (!newCoupon.discountValue) {
    newErrors.discountValue = "할인 값을 입력해주세요";
  } else if (
    newCoupon.discountType === "percentage" &&
    (newCoupon.discountValue < 0 || newCoupon.discountValue > 100)
  ) {
    newErrors.discountValue = "할인율은 0% 이상 100% 이하로 입력해주세요";
  }
  console.log(newErrors);
  return newErrors;
}

export default validateCoupon;
