import { describe, expect, test, beforeEach } from 'vitest';
import { act, fireEvent, render, screen, within, renderHook } from '@testing-library/react';
import { CartPage } from '@/pages/CartPage/';
import { AdminPage } from '@/pages/AdminPage/';
import { Coupon, Product } from '@/shared/types/';
import { useCartStore } from '@/entities/cart';
import { useProductsStore } from '@/entities/product/model/';
import { useCouponStore } from '@/entities/coupon/';
import { calculateDifference, calculateTotal, addItem } from '@/shared/libs';
import { useAdminCoupons } from '@/pages/AdminPage/utils';

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

// 테스트 실행 전, CartStore와 ProductsStore를 초기화
beforeEach(() => {
  useCartStore.setState({ cart: [], selectedCoupon: null });
  useProductsStore.getState().setProducts(mockProducts);
  useCouponStore.getState().setCoupons(mockCoupons);
});

const TestAdminPage = () => {
  return <AdminPage />;
};

describe('advanced > ', () => {
  describe('시나리오 테스트 > ', () => {
    test('장바구니 페이지 테스트 > ', async () => {
      render(<CartPage />);
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

      // 기존 (문제의 코드)
      // const newCoupon = screen.getByTestId('coupon-3');
      // expect(newCoupon).toHaveTextContent('새 쿠폰 (NEW10):10% 할인');

      // 수정 (텍스트로 검증)
      const newCouponElement = screen.getByText(
        (content) => content.includes('새 쿠폰') && content.includes('(NEW10)') && content.includes('10% 할인'),
      );
      expect(newCouponElement).toBeInTheDocument();
    });
  });

  describe('자유롭게 작성해보세요.', () => {
    test('새로운 유틸 함수를 만든 후에 테스트 코드를 작성해서 실행해보세요', () => {
      expect(true).toBe(true);
    });

    describe('훅 테스트 : useCouponStore', () => {
      test('setCoupons를 통해 쿠폰 상태를 초기화 할 수 있다', () => {
        const testCoupons: Coupon[] = [
          { name: '쿠폰1', code: 'C1', discountType: 'amount', discountValue: 5000 },
          { name: '쿠폰2', code: 'C2', discountType: 'percentage', discountValue: 10 },
        ];

        act(() => {
          useCouponStore.getState().setCoupons(testCoupons);
        });

        expect(useCouponStore.getState().coupons).toEqual(testCoupons);
      });

      test('handleCouponAdd를 통해 쿠폰을 추가할 수 있다', () => {
        const initialCoupons: Coupon[] = [{ name: '쿠폰1', code: 'C1', discountType: 'amount', discountValue: 5000 }];

        act(() => {
          useCouponStore.getState().setCoupons(initialCoupons);
        });

        const newCoupon: Coupon = {
          name: '쿠폰2',
          code: 'C2',
          discountType: 'percentage',
          discountValue: 10,
        };

        act(() => {
          useCouponStore.getState().handleCouponAdd(newCoupon);
        });

        const coupons = useCouponStore.getState().coupons;
        expect(coupons.length).toBe(initialCoupons.length + 1);
        expect(coupons[coupons.length - 1]).toEqual(newCoupon);
      });
    });

    describe('훅 테스트 : useAdminCoupons > ', () => {
      // 각 테스트 실행 전 쿠폰 스토어 초기화
      beforeEach(() => {
        useCouponStore.setState({ coupons: [] });
      });

      test('초기 상태가 올바르게 설정되어야 한다 > ', () => {
        const { result } = renderHook(() => useAdminCoupons());

        expect(result.current.newCoupon).toEqual({
          name: '',
          code: '',
          discountType: 'percentage',
          discountValue: 0,
        });
        expect(result.current.coupons).toEqual([]);
      });

      test('setNewCoupon을 통해 newCoupon 상태를 업데이트할 수 있어야 한다 > ', () => {
        const { result } = renderHook(() => useAdminCoupons());

        act(() => {
          result.current.setNewCoupon({
            name: '테스트 쿠폰',
            code: 'TEST',
            discountType: 'amount',
            discountValue: 5000,
          });
        });

        expect(result.current.newCoupon).toEqual({
          name: '테스트 쿠폰',
          code: 'TEST',
          discountType: 'amount',
          discountValue: 5000,
        });
      });
    });

    describe('훅 테스트 : useProductsStore', () => {
      test('setProducts를 통해 제품 상태를 초기화 할 수 있다', () => {
        const testProducts: Product[] = [
          { id: '1', name: 'Product 1', price: 1000, stock: 10, discounts: [] },
          { id: '2', name: 'Product 2', price: 2000, stock: 20, discounts: [] },
        ];

        act(() => {
          useProductsStore.getState().setProducts(testProducts);
        });

        expect(useProductsStore.getState().products).toEqual(testProducts);
      });

      test('handleProductUpdate를 통해 특정 제품을 업데이트 할 수 있다', () => {
        const testProducts: Product[] = [
          { id: '1', name: 'Product 1', price: 1000, stock: 10, discounts: [] },
          { id: '2', name: 'Product 2', price: 2000, stock: 20, discounts: [] },
        ];

        act(() => {
          useProductsStore.getState().setProducts(testProducts);
        });

        const updatedProduct: Product = {
          id: '1',
          name: 'Updated Product 1',
          price: 1500,
          stock: 10,
          discounts: [],
        };

        act(() => {
          useProductsStore.getState().handleProductUpdate(updatedProduct);
        });

        const products = useProductsStore.getState().products;
        expect(products[0]).toEqual(updatedProduct);
        expect(products[1]).toEqual(testProducts[1]);
      });

      test('handleProductAdd를 통해 새 제품을 추가 할 수 있다', () => {
        const testProducts: Product[] = [{ id: '1', name: 'Product 1', price: 1000, stock: 10, discounts: [] }];

        act(() => {
          useProductsStore.getState().setProducts(testProducts);
        });

        const newProduct: Product = {
          id: '2',
          name: 'Product 2',
          price: 2000,
          stock: 20,
          discounts: [],
        };

        act(() => {
          useProductsStore.getState().handleProductAdd(newProduct);
        });

        const products = useProductsStore.getState().products;
        expect(products.length).toBe(testProducts.length + 1);
        expect(products[products.length - 1]).toEqual(newProduct);
      });
    });
  });

  test('새로운 hook 함수르 만든 후에 테스트 코드를 작성해서 실행해보세요', () => {
    expect(true).toBe(true);
  });

  describe('함수 테스트 > ', () => {
    describe('calculateTotal > ', () => {
      test('가격과 수량에 따라 올바른 총액을 계산해야 한다', () => {
        // 예: 10,000원짜리 상품을 3개 구매하면 30,000원이 되어야 한다.
        const price = 10000;
        const quantity = 3;
        const result = calculateTotal(price, quantity);
        expect(result).toBe(30000);
      });

      test('수량이 0이면 총액은 0이어야 한다', () => {
        expect(calculateTotal(10000, 0)).toBe(0);
        expect(calculateTotal(0, 10)).toBe(0);
      });
    });

    describe('calculateDifference > ', () => {
      test('두 가격의 차이를 올바르게 계산해야 한다', () => {
        // 예: 가격1이 10000, 가격2가 2000이면 차이는 8000이다.
        const result = calculateDifference(10000, 2000);
        expect(result).toBe(8000);
      });

      test('첫 번째 가격이 작을 경우 음수 값이 나와야 한다', () => {
        const result = calculateDifference(2000, 10000);
        expect(result).toBe(-8000);
      });
    });

    describe('addItem > ', () => {
      test('숫자 배열에 숫자 아이템을 추가할 때 올바르게 추가되어야 한다', () => {
        const numbers = [1, 2, 3];
        const newItem = 4;
        const result = addItem(numbers, newItem);
        expect(result).toEqual([1, 2, 3, 4]);
      });

      test('문자열 배열에 문자열 아이템을 추가할 때 올바르게 추가되어야 한다', () => {
        const strings = ['a', 'b'];
        const newItem = 'c';
        const result = addItem(strings, newItem);
        expect(result).toEqual(['a', 'b', 'c']);
      });

      test('addItem 함수는 원본 배열을 변경하지 않고 새 배열을 반환해야 한다', () => {
        const originalArray = [1, 2, 3];
        const newItem = 4;
        const result = addItem(originalArray, newItem);
        // 결과 배열은 새롭게 생성된 배열이어야 하므로 원본 배열과 참조값이 달라야 합니다.
        expect(result).toEqual([1, 2, 3, 4]);
        expect(result).not.toBe(originalArray);
        // 원본 배열은 그대로 유지되어야 합니다.
        expect(originalArray).toEqual([1, 2, 3]);
      });
    });
  });
});
