import { useSuspenseQuery } from '@tanstack/react-query';
import { getCoupons } from '@advanced/entities/coupon';

export const useGetCouponQuery = () => {
  return useSuspenseQuery({
    queryKey: ['/api/coupons'],
    queryFn: () => getCoupons(),
  });
};
