import { useState } from "react";
import { Coupon } from "../../../../../types";
import validateCoupon from "../../../../lib/validateCoupon";

interface ValidationErrors {
  name?: string;
  code?: string;
  discountType?: string;
  discountValue?: string;
}

interface CouponAddFormProps {
  newCoupon: Coupon;
  setNewCoupon: (newCoupon: Coupon) => void;
  handleAddCoupon: () => void;
}

function CouponAddForm(props: CouponAddFormProps) {
  const { newCoupon, setNewCoupon, handleAddCoupon } = props;

  const [errors, setErrors] = useState<ValidationErrors>({});

  function handleSubmit() {
    const validationErrors = validateCoupon(newCoupon);
    if (Object.keys(validationErrors).length === 0) {
      handleAddCoupon();
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  }

  return (
    <div className="space-y-2 mb-4">
      <input
        type="text"
        placeholder="쿠폰 이름"
        value={newCoupon.name}
        onChange={(e) => setNewCoupon({ ...newCoupon, name: e.target.value })}
        className="w-full p-2 border rounded"
      />
      {errors.name && (
        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
      )}
      <input
        type="text"
        placeholder="쿠폰 코드"
        value={newCoupon.code}
        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
        className="w-full p-2 border rounded"
      />
      {errors.code && (
        <p className="text-red-500 text-sm mt-1">{errors.code}</p>
      )}
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
        {errors.discountType && (
          <p className="text-red-500 text-sm mt-1">{errors.discountType}</p>
        )}
        <input
          type="number"
          placeholder="할인 값"
          value={newCoupon.discountValue}
          onChange={(e) =>
            setNewCoupon({
              ...newCoupon,
              discountValue: parseInt(e.target.value),
            })
          }
          className="w-full p-2 border rounded"
        />
      </div>
      {errors.discountValue && (
        <p className="text-red-500 text-sm mt-1">{errors.discountValue}</p>
      )}
      <button
        onClick={handleSubmit}
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        쿠폰 추가
      </button>
    </div>
  );
}

export default CouponAddForm;
