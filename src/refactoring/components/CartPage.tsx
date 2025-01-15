import { CartItem, Coupon, Product } from '../../types.ts';
import { useCart } from '../hooks';
import { getMaxApplicableDiscount } from '../models/cart.ts';
import { Container } from './templates/Container.tsx';
import { Title } from './templates/Title.tsx';
import { Button } from './ui/Button.tsx';
import { Card } from './ui/Card.tsx';
import { Select } from './ui/Select.tsx';

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const getRemainingStock = (cart: CartItem[], product: Product) => {
  const cartItem = cart.find(item => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

export const CartPage = ({ products, coupons }: Props) => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  } = useCart();

  const { totalDiscount, totalAfterDiscount, totalBeforeDiscount } =
    calculateTotal();
  const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
    return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
  };

  return (
    <Container>
      <Title level={1}>장바구니</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Title level={2}>상품 목록</Title>
          <div className="space-y-2">
            {products.map(product => {
              const remainingStock = getRemainingStock(cart, product);
              return (
                <Card
                  key={product.id}
                  testId={`product-${product.id}`}
                  padding="sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{product.name}</span>
                    <span className="text-gray-600">
                      {product.price.toLocaleString()}원
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    <span
                      className={`font-medium ${remainingStock > 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      재고: {remainingStock}개
                    </span>
                    {product.discounts.length > 0 && (
                      <span className="ml-2 font-medium text-blue-600">
                        최대{' '}
                        {(getMaxDiscount(product.discounts) * 100).toFixed(0)}%
                        할인
                      </span>
                    )}
                  </div>
                  {product.discounts.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-gray-500 mb-2">
                      {product.discounts.map((discount, index) => (
                        <li key={index}>
                          {discount.quantity}개 이상:{' '}
                          {(discount.rate * 100).toFixed(0)}% 할인
                        </li>
                      ))}
                    </ul>
                  )}
                  <Button
                    variant={remainingStock ? 'primary' : 'secondary'}
                    fullWidth
                    className="px-3"
                    disabled={remainingStock <= 0}
                    onClick={() => addToCart(product)}
                  >
                    {remainingStock > 0 ? '장바구니에 추가' : '품절'}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
        <div>
          <Title level={2}>장바구니 내역</Title>

          <div className="space-y-2">
            {cart.map(item => {
              const appliedDiscount = getMaxApplicableDiscount(item);
              return (
                <Card
                  key={item.product.id}
                  padding="sm"
                  className="flex justify-between items-center"
                >
                  <div>
                    <span className="font-semibold">{item.product.name}</span>
                    <br />
                    <span className="text-sm text-gray-600">
                      {item.product.price}원 x {item.quantity}
                      {appliedDiscount > 0 && (
                        <span className="text-green-600 ml-1">
                          ({(appliedDiscount * 100).toFixed(0)}% 할인 적용)
                        </span>
                      )}
                    </span>
                  </div>
                  <div>
                    <Button
                      variant="secondary"
                      className="mr-1"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                    >
                      -
                    </Button>
                    <Button
                      variant="secondary"
                      className="mr-1"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                    >
                      +
                    </Button>
                    <Button
                      variant="danger"
                      className="mr-1"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      삭제
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card className="mt-6">
            <Title level={2} className="mb-2">
              쿠폰 적용
            </Title>
            <Select
              onChange={e => applyCoupon(coupons[parseInt(e.target.value)])}
              className="mb-2"
            >
              <option value="">쿠폰 선택</option>
              {coupons.map((coupon, index) => (
                <option key={coupon.code} value={index}>
                  {coupon.name} -{' '}
                  {coupon.discountType === 'amount'
                    ? `${coupon.discountValue}원`
                    : `${coupon.discountValue}%`}
                </option>
              ))}
            </Select>
            {selectedCoupon && (
              <p className="text-green-600">
                적용된 쿠폰: {selectedCoupon.name}(
                {selectedCoupon.discountType === 'amount'
                  ? `${selectedCoupon.discountValue}원`
                  : `${selectedCoupon.discountValue}%`}{' '}
                할인)
              </p>
            )}
          </Card>

          <Card className="mt-6">
            <Title level={2} className="mb-2">
              주문 요약
            </Title>
            <div className="space-y-1">
              <p>상품 금액: {totalBeforeDiscount.toLocaleString()}원</p>
              <p className="text-green-600">
                할인 금액: {totalDiscount.toLocaleString()}원
              </p>
              <p className="text-xl font-bold">
                최종 결제 금액: {totalAfterDiscount.toLocaleString()}원
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
};
