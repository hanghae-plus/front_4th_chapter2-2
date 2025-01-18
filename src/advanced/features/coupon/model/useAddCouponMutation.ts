import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addCoupon, Coupon } from '@advanced/entities/coupon';

export const useAddCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['/api/coupons'],
    mutationFn: (Coupon: Coupon) => addCoupon(Coupon),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['/api/coupons'],
        exact: false,
      });
    },
  });
};
