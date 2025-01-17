import { CartItem as CartItemType, Coupon, Product as ProductType } from '../../../types.ts';
import { useCart } from "../../hooks/index.ts";
import { Section } from '../Section.tsx';
import { CartItem } from './CartItem.tsx';
import { Product } from './Product.tsx';
import { CouponSelect } from './CouponSelect.tsx';
import { Title, Container } from '../Styled.tsx';

interface Props {
  products: ProductType[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
    getRemainingStock
  } = useCart();

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal()

  const getAppliedDiscount = ({ product: { discounts }, quantity }: CartItemType) => {
    return discounts.reduce((acc, cur) => {
      return quantity >= cur.quantity ? Math.max(acc, cur.rate) : acc;
    }, 0);
  };

  return (
    <Section
      className='container mx-auto p-4'
      title={<Title.Main>장바구니</Title.Main>}
    >
      <Container.Grid>
        <Section
          title={<Title.Sub>상품 목록</Title.Sub>}
        >
          <Container>
            {products.map(product => (
              <Product
                key={`product-${product.id}`}
                addToCart={addToCart}
                remainingStock={getRemainingStock(product)}
                {...product}
              />
            ))}
          </Container>
        </Section>

        <Section
          title={<Title.Sub>장바구니 내역</Title.Sub>}
        >
          <Container>
            {cart.map(item => (
              <CartItem
                key={`cartItem-${item.product.id}`}
                appliedDiscount={getAppliedDiscount(item)}
                increaseQuantity={() => updateQuantity(item.product.id, item.quantity + 1)}
                decreaseQuantity={() => updateQuantity(item.product.id, item.quantity - 1)}
                removeCartItem={() => removeFromCart(item.product.id)}
                {...item}
              />
            ))}
          </Container>

          <Section
            className="mt-6 bg-white p-4 rounded shadow"
            title={<Title.Container>쿠폰 적용</Title.Container>}
          >
            <CouponSelect
              couponList={coupons}
              applyCoupon={applyCoupon}
              selectedCoupon={selectedCoupon}
            />
          </Section>

          <Section
            className="mt-6 bg-white p-4 rounded shadow"
            title={<Title.Container>주문 요약</Title.Container>}
          >
            <Container>
              <p>상품 금액: {totalBeforeDiscount.toLocaleString()}원</p>
              <p className="text-green-600">할인 금액: {totalDiscount.toLocaleString()}원</p>
              <p className="text-xl font-bold">
                최종 결제 금액: {totalAfterDiscount.toLocaleString()}원
              </p>
            </Container>
          </Section>
        </Section>
      </Container.Grid>
    </Section>
  );
};
