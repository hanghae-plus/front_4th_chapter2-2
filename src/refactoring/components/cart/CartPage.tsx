import { Coupon, Product } from '../../../types.ts';
import { useCart } from '../../hooks/index.ts';
import {
  getMaxApplicableDiscount,
  getMaxDiscount,
} from '../../models/index.ts';
import {
  CartItemCard,
  ProductItem,
  CartSelectCoupon,
  CartOrderSummary,
} from './index.ts';

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  const {
    cart,
    addToCart,
    getRemainingStock,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  } = useCart();

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
    calculateTotal();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
          <div className="space-y-2">
            {products.map((product) => {
              const remainingStock = getRemainingStock(product);
              const maxDiscount = (
                getMaxDiscount(product.discounts) * 100
              ).toFixed(0);

              return (
                <ProductItem
                  product={product}
                  remainingStock={remainingStock}
                  maxDiscount={maxDiscount}
                  onClickAddToCart={() => addToCart(product)}
                />
              );
            })}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>

          <div className="space-y-2">
            {cart.map((item) => {
              const appliedDiscount = getMaxApplicableDiscount(item);

              return (
                <CartItemCard
                  item={item}
                  appliedDiscount={appliedDiscount}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              );
            })}
          </div>

          <CartSelectCoupon
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            applyCoupon={applyCoupon}
          />
          
          <CartOrderSummary
            totalBeforeDiscount={totalBeforeDiscount}
            totalDiscount={totalDiscount}
            totalAfterDiscount={totalAfterDiscount}
          />
        </div>
      </div>
    </div>
  );
};
