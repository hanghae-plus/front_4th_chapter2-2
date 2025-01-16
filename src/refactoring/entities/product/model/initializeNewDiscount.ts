import { Discount } from '../../../shared/types/types';

export const initializeNewDiscount = (): Discount => ({
  quantity: 0,
  rate: 0,
});
