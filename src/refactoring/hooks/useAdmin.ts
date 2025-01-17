import { Product, Coupon, Discount } from '../../types.ts';
import {
  validateCouponData,
  validateDiscount,
  validateProductData,
} from '../utils/validateData.ts';

interface UseAdminProps {
  products: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const useAdmin = ({
  products,
  onProductUpdate,
  onProductAdd,
  onCouponAdd,
}: UseAdminProps) => {
  const updateProduct = (product: Product): boolean => {
    const productToValidate = {
      name: product.name,
      price: product.price,
      stock: product.stock,
    };

    if (validateProductData(productToValidate)) {
      onProductUpdate(product);

      return true;
    }

    return false;
  };

  const addProduct = (product: Omit<Product, 'id'>): boolean => {
    if (validateProductData(product)) {
      const newProduct = { ...product, id: Date.now().toString() };

      onProductAdd(newProduct);

      return true;
    }

    return false;
  };

  const addCoupon = (coupon: Coupon): boolean => {
    if (validateCouponData(coupon)) {
      onCouponAdd(coupon);

      return true;
    }

    return false;
  };

  const addDiscount = (productId: string, discount: Discount): boolean => {
    if (!validateDiscount(discount.quantity, discount.rate * 100)) return false;

    const product = products.find((p) => p.id === productId);

    if (!product) return false;

    const updatedProduct = {
      ...product,
      discounts: [...product.discounts, discount],
    };

    updateProduct(updatedProduct);

    return true;
  };

  const removeDiscount = (productId: string, discountIndex: number) => {
    const product = products.find((p) => p.id === productId);

    if (!product) return false;

    const updatedProduct = {
      ...product,
      discounts: product.discounts.filter((_, index) => index !== discountIndex),
    };

    updateProduct(updatedProduct);

    return true;
  };

  return {
    updateProduct,
    addProduct,
    addCoupon,
    addDiscount,
    removeDiscount,
  };
};
