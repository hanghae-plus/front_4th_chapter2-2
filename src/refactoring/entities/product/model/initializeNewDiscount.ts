import { getUniqueId } from '../../../pages/shared/lib/getUniqueId';
import { Discount } from '../../../shared/types/types';

export const initializeNewDiscount = (): Discount => ({
  id: getUniqueId(),
  quantity: 0,
  rate: 0,
});
