import { useState } from 'react';
import { useProducts } from './useProduct';
import { useCoupons } from './useCoupon';
import { initialProductList, initialCouponList } from '../data/initialData';

export const useAppState = () => {
  const { productList, updateProduct, addProduct } = useProducts(initialProductList);
  const { couponList, addCoupon } = useCoupons(initialCouponList);
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleAdmin = () => setIsAdmin((prev) => !prev);

  return {
    isAdmin,
    toggleAdmin,
    productList,
    couponList,
    updateProduct,
    addProduct,
    addCoupon,
  };
};
