import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { addCoupon, Coupon, getCoupons } from '@advanced/entities/coupon';

export const useGetCouponQuery = () => {
  return useSuspenseQuery({
    queryKey: ['/api/coupons'],
    queryFn: () => getCoupons(),
  });
};

export const useAddProductMutation = (Coupon: Coupon) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['/api/products'],
    mutationFn: () => addCoupon(Coupon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/coupons'] });
    },
  });
};
