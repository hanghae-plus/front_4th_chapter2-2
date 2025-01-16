import {
  Coupon,
  DISCOUNT_TYPE_PERCENTAGE,
  DiscountType,
} from "../../../../types";
import Input from "../../common/Input";
import Button from "../../common/Button";
import { useForm } from "../../../hooks";
import { createValidators, validateField } from "../../../utils/validatorUtils";
import { useState } from "react";

interface CouponFormProps {
  onSubmit: (addCoupon: Coupon) => void;
}
type FieldValues = Coupon;

const CouponForm = ({ onSubmit }: CouponFormProps) => {
  const [discountType, setDiscountType] = useState<DiscountType>(
    DISCOUNT_TYPE_PERCENTAGE
  );
  const form = useForm<FieldValues>({
    defaultValues: {
      name: "",
      code: "",
      discountType: DISCOUNT_TYPE_PERCENTAGE,
      discountValue: 0,
    },
  });

  const validateFields = (addCoupon: FieldValues) => {
    const validator = createValidators<FieldValues>();

    return Object.entries(addCoupon).reduce(
      (acc: Record<string, string>, [key, value]) => {
        const errorMessage = validateField(value, [validator.required()]);
        if (errorMessage) {
          return {
            ...acc,
            [key]: errorMessage,
          };
        }
        return acc;
      },
      {} as Record<string, string>
    );
  };

  const handleAddCoupon = (addCoupon: FieldValues) => {
    const errors = validateFields(addCoupon);

    if (Object.keys(errors).length > 0) {
      const messages = Object.entries(errors).map(
        ([key, value]) => `${key}값은 ${value}`
      );

      alert(messages);
      return;
    }

    onSubmit(addCoupon);
  };

  return (
    <form
      className="space-y-2 mb-4"
      onSubmit={form.handleSubmit(handleAddCoupon)}
    >
      <Input type="text" placeholder="쿠폰 이름" {...form.register("name")} />
      <Input type="text" placeholder="쿠폰 코드" {...form.register("code")} />
      <div className="flex gap-2">
        <select
          value={discountType}
          onChange={(e) => setDiscountType(e.target.value as DiscountType)}
          className="w-full p-2 border rounded"
        >
          <option value="amount">금액(원)</option>
          <option value="percentage">할인율(%)</option>
        </select>
        <Input
          type="number"
          placeholder="할인 값"
          {...form.register("discountValue")}
        />
      </div>
      <Button type="submit" variant="success" className="w-full p-2">
        쿠폰 추가
      </Button>
    </form>
  );
};

export default CouponForm;
