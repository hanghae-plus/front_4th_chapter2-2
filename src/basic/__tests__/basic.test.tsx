// [basic.test.ts]
import { useState } from 'react';
import { describe, expect, test, beforeEach } from 'vitest';
import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import { CartPage } from '@/pages/CartPage/';
import { AdminPage } from '@/pages/AdminPage/';
import { CartItem, Coupon, Product } from '@/shared/types/';
import * as cartUtils from '@/entities/cart/model/';
import { useCartStore } from '@/entities/cart';
import { useCoupons } from '@/entities/coupon';
import { useProductsStore } from '@/entities/product/model/';

// mock 데이터
const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
];

const mockCoupons: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

// 관리자 페이지에서 쿠폰 관련 상태 관리를 위한 테스트 컴포넌트
const TestAdminPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const handleCouponAdd = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return <AdminPage coupons={coupons} onCouponAdd={handleCouponAdd} />;
};

// 테스트 실행 전, CartStore와 ProductsStore를 초기화
beforeEach(() => {
  useCartStore.setState({ cart: [], selectedCoupon: null });
  useProductsStore.getState().setProducts(mockProducts);
});

describe('basic > ', () => {
  describe('시나리오 테스트 > ', () => {
    test('장바구니 페이지 테스트 > ', async () => {
      render(<CartPage coupons={mockCoupons} />);
      // CartPage에서는 각 제품 카드를 data-testid={`product-${product.id}`}로 렌더링한다고 가정
      const product1 = screen.getByTestId('product-p1');
      const product2 = screen.getByTestId('product-p2');
      const product3 = screen.getByTestId('product-p3');

      const addToCartButton1 = within(product1).getByText('장바구니에 추가');
      const addToCartButton2 = within(product2).getByText('장바구니에 추가');
      const addToCartButton3 = within(product3).getByText('장바구니에 추가');

      // 1. 상품 정보 표시
      expect(product1).toHaveTextContent('상품1');
      expect(product1).toHaveTextContent('10,000원');
      expect(product1).toHaveTextContent('재고: 20개');
      expect(product2).toHaveTextContent('상품2');
      expect(product2).toHaveTextContent('20,000원');
      expect(product2).toHaveTextContent('재고: 20개');
      expect(product3).toHaveTextContent('상품3');
      expect(product3).toHaveTextContent('30,000원');
      expect(product3).toHaveTextContent('재고: 20개');

      // 2. 할인 정보 표시 (예: 할인 설명)
      expect(screen.getByText('10개 이상: 10% 할인')).toBeInTheDocument();

      // 3. 상품1 장바구니에 상품 추가
      fireEvent.click(addToCartButton1);

      // 4. 할인율 계산 (CartPage 내부에서 주문 요약 영역에 결과가 반영된다고 가정)
      expect(screen.getByText('상품 금액: 10,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 0원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 10,000원')).toBeInTheDocument();

      // 5. 상품 품절 상태로 만들기 (상품1의 재고가 0이 되어야 함)
      for (let i = 0; i < 19; i++) {
        fireEvent.click(addToCartButton1);
      }
      expect(product1).toHaveTextContent('재고: 0개');
      fireEvent.click(addToCartButton1);
      expect(product1).toHaveTextContent('재고: 0개');

      // 7. 할인율 계산 결과 체크 (예시)
      expect(screen.getByText('상품 금액: 200,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 20,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 180,000원')).toBeInTheDocument();

      // 8. 상품2와 상품3 각각 10개씩 추가하기
      fireEvent.click(addToCartButton2);
      fireEvent.click(addToCartButton3);
      const increaseButtons = screen.getAllByText('+');
      for (let i = 0; i < 9; i++) {
        fireEvent.click(increaseButtons[1]); // 상품2 증가
        fireEvent.click(increaseButtons[2]); // 상품3 증가
      }

      // 9. 할인율 계산 결과 체크
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 110,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 590,000원')).toBeInTheDocument();

      // 10. 쿠폰 적용하기
      const couponSelect = screen.getByRole('combobox');
      fireEvent.change(couponSelect, { target: { value: '1' } });

      // 11. 쿠폰 적용 후 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 169,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 531,000원')).toBeInTheDocument();

      // 12. 다른 쿠폰 적용
      fireEvent.change(couponSelect, { target: { value: '0' } });
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 115,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 585,000원')).toBeInTheDocument();
    });

    test('관리자 페이지 테스트 > ', async () => {
      render(<TestAdminPage />);
      // AdminPage에서는 제품 항목을 data-testid={`product-${product.id}`}로 렌더링한다고 가정
      const product1 = screen.getByTestId('product-p1');

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText('새 상품 추가'));
      fireEvent.change(screen.getByLabelText('상품명'), { target: { value: '상품4' } });
      fireEvent.change(screen.getByLabelText('가격'), { target: { value: '15000' } });
      fireEvent.change(screen.getByLabelText('재고'), { target: { value: '30' } });
      fireEvent.click(screen.getByText('추가'));

      const product4 = screen.getByTestId('product-p4');
      expect(product4).toHaveTextContent('상품4');
      expect(product4).toHaveTextContent('15000원');
      expect(product4).toHaveTextContent('재고: 30');

      // 2. 상품 선택 및 수정
      fireEvent.click(product1);
      fireEvent.click(within(product1).getByTestId('toggle-button'));
      fireEvent.click(within(product1).getByTestId('modify-button'));

      act(() => {
        fireEvent.change(within(product1).getByDisplayValue('20'), { target: { value: '25' } });
        fireEvent.change(within(product1).getByDisplayValue('10000'), { target: { value: '12000' } });
        fireEvent.change(within(product1).getByDisplayValue('상품1'), { target: { value: '수정된 상품1' } });
      });
      fireEvent.click(within(product1).getByText('수정 완료'));

      expect(product1).toHaveTextContent('수정된 상품1');
      expect(product1).toHaveTextContent('12000원');
      expect(product1).toHaveTextContent('재고: 25');

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click(product1);
      fireEvent.click(within(product1).getByTestId('modify-button'));
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('수량'), { target: { value: '5' } });
        fireEvent.change(screen.getByPlaceholderText('할인율 (%)'), { target: { value: '5' } });
      });
      fireEvent.click(screen.getByText('할인 추가'));
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument();

      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument();
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument();

      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument();
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).not.toBeInTheDocument();

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText('쿠폰 이름'), { target: { value: '새 쿠폰' } });
      fireEvent.change(screen.getByPlaceholderText('쿠폰 코드'), { target: { value: 'NEW10' } });
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'percentage' } });
      fireEvent.change(screen.getByPlaceholderText('할인 값'), { target: { value: '10' } });
      fireEvent.click(screen.getByText('쿠폰 추가'));

      const newCoupon = screen.getByTestId('coupon-3');
      expect(newCoupon).toHaveTextContent('새 쿠폰 (NEW10):10% 할인');
    });
  });

  describe('useProductsStore > ', () => {
    const initialProductsSample: Product[] = [{ id: '1', name: 'Product 1', price: 100, stock: 10, discounts: [] }];

    test('특정 제품으로 초기화할 수 있다.', () => {
      act(() => {
        useProductsStore.getState().setProducts(initialProductsSample);
      });
      const products = useProductsStore.getState().products;
      expect(products).toEqual(initialProductsSample);
    });

    test('제품을 업데이트할 수 있다.', () => {
      act(() => {
        useProductsStore.getState().setProducts(initialProductsSample);
      });
      const updatedProduct = { ...initialProductsSample[0], name: 'Updated Product' };

      act(() => {
        useProductsStore.getState().handleProductUpdate(updatedProduct);
      });
      const products = useProductsStore.getState().products;
      expect(products[0]).toEqual(updatedProduct);
    });

    test('새로운 제품을 추가할 수 있다.', () => {
      act(() => {
        useProductsStore.getState().setProducts(initialProductsSample);
      });
      const newProduct: Product = {
        id: '2',
        name: 'New Product',
        price: 200,
        stock: 5,
        discounts: [],
      };

      act(() => {
        useProductsStore.getState().handleProductAdd(newProduct);
      });
      const products = useProductsStore.getState().products;
      expect(products).toHaveLength(2);
      expect(products[1]).toEqual(newProduct);
    });
  });

  describe('useCoupons > ', () => {
    test('쿠폰을 초기화할 수 있다.', () => {
      const { result } = renderHook(() => useCoupons(mockCoupons));
      expect(result.current.coupons).toEqual(mockCoupons);
    });

    test('쿠폰을 추가할 수 있다', () => {
      const { result } = renderHook(() => useCoupons(mockCoupons));
      const newCoupon: Coupon = {
        name: 'New Coupon',
        code: 'NEWCODE',
        discountType: 'amount',
        discountValue: 5000,
      };

      act(() => {
        result.current.addCoupon(newCoupon);
      });
      expect(result.current.coupons).toHaveLength(3);
      expect(result.current.coupons[2]).toEqual(newCoupon);
    });
  });

  describe('cartUtils', () => {
    const testProduct: Product = {
      id: '1',
      name: 'Test Product',
      price: 100,
      stock: 10,
      discounts: [
        { quantity: 2, rate: 0.1 },
        { quantity: 5, rate: 0.2 },
      ],
    };

    describe('calculateItemTotal', () => {
      test('할인 없이 총액을 계산해야 합니다.', () => {
        const item: CartItem = { product: testProduct, quantity: 1 };
        expect(cartUtils.calculateItemTotal(item)).toBe(100);
      });

      test('수량에 따라 올바른 할인을 적용해야 합니다.', () => {
        const item: CartItem = { product: testProduct, quantity: 5 };
        expect(cartUtils.calculateItemTotal(item)).toBe(400); // 예: 500 * 0.8
      });
    });

    describe('getMaxApplicableDiscount', () => {
      test('할인이 적용되지 않으면 0을 반환해야 합니다.', () => {
        const item: CartItem = { product: testProduct, quantity: 1 };
        expect(cartUtils.getMaxApplicableDiscount(item)).toBe(0);
      });

      test('적용 가능한 가장 높은 할인율을 반환해야 합니다.', () => {
        const item: CartItem = { product: testProduct, quantity: 5 };
        expect(cartUtils.getMaxApplicableDiscount(item)).toBe(0.2);
      });
    });

    describe('calculateCartTotal', () => {
      const cart: CartItem[] = [
        { product: testProduct, quantity: 2 },
        { product: { ...testProduct, id: '2', price: 200 }, quantity: 1 },
      ];

      test('쿠폰 없이 총액을 올바르게 계산해야 합니다.', () => {
        const result = cartUtils.calculateCartTotal(cart, null);
        expect(result.totalBeforeDiscount).toBe(400);
        expect(result.totalAfterDiscount).toBe(380);
        expect(result.totalDiscount).toBe(20);
      });

      test('금액쿠폰을 올바르게 적용해야 합니다.', () => {
        const coupon: Coupon = {
          name: 'Test Coupon',
          code: 'TEST',
          discountType: 'amount',
          discountValue: 50,
        };
        const result = cartUtils.calculateCartTotal(cart, coupon);
        expect(result.totalAfterDiscount).toBe(330);
        expect(result.totalDiscount).toBe(70);
      });

      test('퍼센트 쿠폰을 올바르게 적용해야 합니다', () => {
        const coupon: Coupon = {
          name: 'Test Coupon',
          code: 'TEST',
          discountType: 'percentage',
          discountValue: 10,
        };
        const result = cartUtils.calculateCartTotal(cart, coupon);
        expect(result.totalAfterDiscount).toBe(342);
        expect(result.totalDiscount).toBe(58);
      });
    });

    describe('updateCartItemQuantity', () => {
      const cart: CartItem[] = [
        { product: testProduct, quantity: 2 },
        { product: { ...testProduct, id: '2' }, quantity: 1 },
      ];

      test('수량을 올바르게 업데이트해야 합니다', () => {
        const updatedCart = cartUtils.updateCartItemQuantity(cart, '1', 5);
        expect(updatedCart[0].quantity).toBe(5);
        expect(updatedCart[1].quantity).toBe(1);
      });

      test('수량이 0으로 설정된 경우 항목을 제거해야 합니다.', () => {
        const updatedCart = cartUtils.updateCartItemQuantity(cart, '1', 0);
        expect(updatedCart.length).toBe(1);
        expect(updatedCart[0].product.id).toBe('2');
      });

      test('재고 한도를 초과해서는 안 됩니다.', () => {
        const updatedCart = cartUtils.updateCartItemQuantity(cart, '1', 15);
        expect(updatedCart[0].quantity).toBe(10); // 최대 재고가 10
      });
    });
  });

  describe('useCartStore > ', () => {
    const testProduct: Product = {
      id: '1',
      name: 'Test Product',
      price: 100,
      stock: 10,
      discounts: [],
    };
    const testCoupon: Coupon = {
      name: 'Test Coupon',
      code: 'TEST',
      discountType: 'percentage',
      discountValue: 10,
    };

    test('장바구니에 제품을 추가해야 합니다', () => {
      const { result } = renderHook(() => useCartStore());
      act(() => {
        result.current.addToCart(testProduct);
      });
      expect(result.current.cart).toHaveLength(1);
      expect(result.current.cart[0]).toEqual({ product: testProduct, quantity: 1 });
    });

    test('장바구니에서 제품을 제거해야 합니다', () => {
      const { result } = renderHook(() => useCartStore());
      act(() => {
        result.current.addToCart(testProduct);
        result.current.removeFromCart(testProduct.id);
      });
      expect(result.current.cart).toHaveLength(0);
    });

    test('제품 수량을 업데이트해야 합니다', () => {
      const { result } = renderHook(() => useCartStore());
      act(() => {
        result.current.addToCart(testProduct);
        result.current.updateQuantity(testProduct.id, 5);
      });
      expect(result.current.cart[0].quantity).toBe(5);
    });

    test('쿠폰을 적용해야지', () => {
      const { result } = renderHook(() => useCartStore());
      act(() => {
        result.current.applyCoupon(testCoupon);
      });
      expect(result.current.selectedCoupon).toEqual(testCoupon);
    });

    test('합계를 정확하게 계산해야 합니다', () => {
      const { result } = renderHook(() => useCartStore());
      act(() => {
        result.current.addToCart(testProduct);
        result.current.updateQuantity(testProduct.id, 2);
        result.current.applyCoupon(testCoupon);
      });
      const total = result.current.calculateTotal();
      expect(total.totalBeforeDiscount).toBe(200);
      expect(total.totalAfterDiscount).toBe(180);
      expect(total.totalDiscount).toBe(20);
    });
  });
});
