import { Coupon } from "../../../../types";
import Input from "../../common/Input";
import Button from "../../common/Button";

interface CouponFormProps {
  coupon: Coupon;
  onChange: React.Dispatch<React.SetStateAction<Coupon>>;
  onSubmit: () => void;
}

const CouponForm = ({ coupon, onChange, onSubmit }: CouponFormProps) => {
  return (
    <div className="space-y-2 mb-4">
      <Input
        type="text"
        placeholder="쿠폰 이름"
        value={coupon.name}
        onChange={(e) => onChange({ ...coupon, name: e.target.value })}
      />
      <Input
        type="text"
        placeholder="쿠폰 코드"
        value={coupon.code}
        onChange={(e) => onChange({ ...coupon, code: e.target.value })}
      />
      <div className="flex gap-2">
        <select
          value={coupon.discountType}
          onChange={(e) =>
            onChange({
              ...coupon,
              discountType: e.target.value as "amount" | "percentage",
            })
          }
          className="w-full p-2 border rounded"
        >
          <option value="amount">금액(원)</option>
          <option value="percentage">할인율(%)</option>
        </select>
        <Input
          type="number"
          placeholder="할인 값"
          value={coupon.discountValue}
          onChange={(e) =>
            onChange({
              ...coupon,
              discountValue: parseInt(e.target.value),
            })
          }
        />
      </div>
      <Button onClick={onSubmit} variant="success" className="w-full p-2">
        쿠폰 추가
      </Button>
    </div>
  );
};

export default CouponForm;
