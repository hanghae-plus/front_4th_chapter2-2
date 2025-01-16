import { usePreservedCallback } from './usePreservedCallback';

type Positive<T> = T extends number ? (`${T}` extends `-${number}` ? never : T) : never;
type Int<T> = T extends number ? (`${T}` extends `${number}.${number}` ? never : T) : never;

export type Discount =
  | {
      type: 'amount';
      value: number;
    }
  | {
      type: 'percentage';
      value: number;
    };

export const useDiscountCalculator = () => {
  return usePreservedCallback((amount: number, discounts: Discount[]) => {
    let result = amount;

    discounts.forEach((discount) => {
      if (discount.type === 'amount') {
        result = Math.max(0, result - discount.value);
        return;
      }

      if (discount.type === 'percentage') {
        result = result * (1 - discount.value / 100);
        return;
      }
    });

    return result;
  });
};
