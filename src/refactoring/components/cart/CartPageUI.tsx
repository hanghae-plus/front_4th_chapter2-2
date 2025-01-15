import { CartItemType, CouponType, ProductType } from '../../types';
import { CartItem } from './CartItem';
import { ProductItem } from './ProductItem';
import { CouponSelector } from './CouponSelector';
import { OrderSummary } from './OrderSummary';

interface Props {
  productList: ProductType[];
  couponList: CouponType[];
  cart: CartItemType[];
  addToCart: (product: ProductType) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (coupon: CouponType) => void;
  selectedCoupon: CouponType | null;
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
  getMaxDiscount: (discounts: { quantity: number; rate: number }[]) => number;
  getRemainingStock: (product: ProductType) => number;
  getAppliedDiscount: (item: CartItemType) => number;
}

export const CartPageUI = ({
  productList,
  couponList,
  cart,
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  selectedCoupon,
  totalBeforeDiscount,
  totalAfterDiscount,
  totalDiscount,
  getMaxDiscount,
  getRemainingStock,
  getAppliedDiscount,
}: Props) => (
  <div className='container mx-auto p-4'>
    <h1 className='text-3xl font-bold mb-6'>장바구니</h1>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      <div>
        <h2 className='text-2xl font-semibold mb-4'>상품 목록</h2>
        <div className='space-y-2'>
          {productList.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              remainingStock={getRemainingStock(product)}
              addToCart={addToCart}
              getMaxDiscount={getMaxDiscount}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className='text-2xl font-semibold mb-4'>장바구니 내역</h2>
        <div className='space-y-2'>
          {cart.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              getAppliedDiscount={getAppliedDiscount}
            />
          ))}
        </div>

        <CouponSelector
          couponList={couponList}
          applyCoupon={applyCoupon}
          selectedCoupon={selectedCoupon}
        />

        <OrderSummary
          totalBeforeDiscount={totalBeforeDiscount}
          totalAfterDiscount={totalAfterDiscount}
          totalDiscount={totalDiscount}
        />
      </div>
    </div>
  </div>
);
