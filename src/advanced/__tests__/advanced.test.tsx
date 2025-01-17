import { useState } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  within,
} from '@testing-library/react';
import CartPage from '../refactoring/components/CartPage';
import AdminPage from '../refactoring/components/AdminPage';
import { Coupon } from '../refactoring/models/types/Coupon';
import { Product } from '../refactoring/models/types/Product';
import ProductContextProvider from '../refactoring/components/shared/product/context/ProductContextProvider';
import { useProducts } from '../refactoring/hooks';
import { useDiscount } from '../refactoring/hooks/admin/useDiscount';
import { useCreateCoupon } from '../refactoring/hooks/admin/useCreateCoupon';
import {
  addProductDiscount,
  removeProductDiscount,
} from '../refactoring/models/discount';
import { useCreateProduct } from '../refactoring/hooks/admin/useCreateProduct';

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

const TestAdminPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);

  const handleCouponAdd = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return (
    <ProductContextProvider initProducts={mockProducts}>
      <AdminPage coupons={coupons} onCouponAdd={handleCouponAdd} />;
    </ProductContextProvider>
  );
};

const TestCartPage = () => {
  return (
    <ProductContextProvider initProducts={mockProducts}>
      <CartPage coupons={mockCoupons} />
    </ProductContextProvider>
  );
};

describe('advanced > ', () => {
  describe('시나리오 테스트 > ', () => {
    test('장바구니 페이지 테스트 > ', async () => {
      render(<TestCartPage />);
      const product1 = screen.getByTestId('product-p1');
      const product2 = screen.getByTestId('product-p2');
      const product3 = screen.getByTestId('product-p3');
      const addToCartButtonsAtProduct1 =
        within(product1).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct2 =
        within(product2).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct3 =
        within(product3).getByText('장바구니에 추가');

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

      // 2. 할인 정보 표시
      expect(screen.getByText('10개 이상: 10% 할인')).toBeInTheDocument();

      // 3. 상품1 장바구니에 상품 추가
      fireEvent.click(addToCartButtonsAtProduct1); // 상품1 추가

      // 4. 할인율 계산
      expect(screen.getByText('상품 금액: 10,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 0원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 10,000원')).toBeInTheDocument();

      // 5. 상품 품절 상태로 만들기
      for (let i = 0; i < 19; i++) {
        fireEvent.click(addToCartButtonsAtProduct1);
      }

      // 6. 품절일 때 상품 추가 안 되는지 확인하기
      expect(product1).toHaveTextContent('재고: 0개');
      fireEvent.click(addToCartButtonsAtProduct1);
      expect(product1).toHaveTextContent('재고: 0개');

      // 7. 할인율 계산
      expect(screen.getByText('상품 금액: 200,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 20,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 180,000원')).toBeInTheDocument();

      // 8. 상품을 각각 10개씩 추가하기
      fireEvent.click(addToCartButtonsAtProduct2); // 상품2 추가
      fireEvent.click(addToCartButtonsAtProduct3); // 상품3 추가

      const increaseButtons = screen.getAllByText('+');
      for (let i = 0; i < 9; i++) {
        fireEvent.click(increaseButtons[1]); // 상품2
        fireEvent.click(increaseButtons[2]); // 상품3
      }

      // 9. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 110,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 590,000원')).toBeInTheDocument();

      // 10. 쿠폰 적용하기
      const couponSelect = screen.getByRole('combobox');
      fireEvent.change(couponSelect, { target: { value: '1' } }); // 10% 할인 쿠폰 선택

      // 11. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 169,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 531,000원')).toBeInTheDocument();

      // 12. 다른 할인 쿠폰 적용하기
      fireEvent.change(couponSelect, { target: { value: '0' } }); // 5000원 할인 쿠폰
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 115,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 585,000원')).toBeInTheDocument();
    });

    test('관리자 페이지 테스트 > ', async () => {
      render(<TestAdminPage />);

      const $product1 = screen.getByTestId('product-1');

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText('새 상품 추가'));

      fireEvent.change(screen.getByLabelText('상품명'), {
        target: { value: '상품4' },
      });
      fireEvent.change(screen.getByLabelText('가격'), {
        target: { value: '15000' },
      });
      fireEvent.change(screen.getByLabelText('재고'), {
        target: { value: '30' },
      });

      fireEvent.click(screen.getByText('추가'));

      const $product4 = screen.getByTestId('product-4');

      expect($product4).toHaveTextContent('상품4');
      expect($product4).toHaveTextContent('15000원');
      expect($product4).toHaveTextContent('재고: 30');

      // 2. 상품 선택 및 수정
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('toggle-button'));
      fireEvent.click(within($product1).getByTestId('modify-button'));

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue('20'), {
          target: { value: '25' },
        });
        fireEvent.change(within($product1).getByDisplayValue('10000'), {
          target: { value: '12000' },
        });
        fireEvent.change(within($product1).getByDisplayValue('상품1'), {
          target: { value: '수정된 상품1' },
        });
      });

      fireEvent.click(within($product1).getByText('수정 완료'));

      expect($product1).toHaveTextContent('수정된 상품1');
      expect($product1).toHaveTextContent('12000원');
      expect($product1).toHaveTextContent('재고: 25');

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('modify-button'));

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('수량'), {
          target: { value: '5' },
        });
        fireEvent.change(screen.getByPlaceholderText('할인율 (%)'), {
          target: { value: '5' },
        });
      });
      fireEvent.click(screen.getByText('할인 추가'));

      expect(
        screen.queryByText('5개 이상 구매 시 5% 할인'),
      ).toBeInTheDocument();

      // 할인 삭제
      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(
        screen.queryByText('10개 이상 구매 시 10% 할인'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('5개 이상 구매 시 5% 할인'),
      ).toBeInTheDocument();

      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(
        screen.queryByText('10개 이상 구매 시 10% 할인'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('5개 이상 구매 시 5% 할인'),
      ).not.toBeInTheDocument();

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText('쿠폰 이름'), {
        target: { value: '새 쿠폰' },
      });
      fireEvent.change(screen.getByPlaceholderText('쿠폰 코드'), {
        target: { value: 'NEW10' },
      });
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'percentage' },
      });
      fireEvent.change(screen.getByPlaceholderText('할인 값'), {
        target: { value: '10' },
      });

      fireEvent.click(screen.getByText('쿠폰 추가'));

      const $newCoupon = screen.getByTestId('coupon-3');

      expect($newCoupon).toHaveTextContent('새 쿠폰 (NEW10):10% 할인');
    });
  });

  describe('계산 함수 테스트 > ', () => {
    describe('discount > ', () => {
      test('할인 추가 함수 테스트 > ', () => {
        const result = addProductDiscount(
          { ...mockProducts[0] },
          {
            quantity: 10,
            rate: 50,
          },
        );

        expect(result.discounts).toHaveLength(2);
        expect(result.discounts[result.discounts.length - 1]).toEqual({
          quantity: 10,
          rate: 50,
        });
      });
      test('할인 삭제 함수 테스트 > ', () => {
        const result = removeProductDiscount({ ...mockProducts[0] }, 0);

        expect(result.discounts).toHaveLength(0);
      });
    });
  });

  describe('커스텀 훅 테스트', () => {
    describe('useProducts > ', () => {
      const initialProducts: Product[] = [
        {
          id: '1',
          name: 'Product 1',
          price: 100,
          stock: 10,
          discounts: [],
        },
      ];

      test('초기 상태를 제대로 반환해야 한다.', () => {
        const { result } = renderHook(() => useProducts(), {
          wrapper: ({ children }) => (
            <ProductContextProvider initProducts={initialProducts}>
              {children}
            </ProductContextProvider>
          ),
        });
        // 초기 상태 확인
        expect(result.current.products).toEqual(initialProducts);
      });

      test('제품을 업데이트할 수 있다.', () => {
        const { result } = renderHook(() => useProducts(), {
          wrapper: ({ children }) => (
            <ProductContextProvider initProducts={initialProducts}>
              {children}
            </ProductContextProvider>
          ),
        });
        const updatedProduct = {
          ...initialProducts[0],
          name: 'Updated Product',
        };

        act(() => {
          result.current.updateProduct(updatedProduct);
        });

        expect(result.current.products[0]).toEqual({
          discounts: [],
          id: '1',
          name: 'Updated Product',
          price: 100,
          stock: 10,
        });
      });

      test('새로운 제품을 추가할 수 있다.', () => {
        const { result } = renderHook(() => useProducts(), {
          wrapper: ({ children }) => (
            <ProductContextProvider initProducts={initialProducts}>
              {children}
            </ProductContextProvider>
          ),
        });
        const newProduct: Product = {
          id: '2',
          name: 'New Product',
          price: 200,
          stock: 5,
          discounts: [],
        };

        act(() => {
          result.current.addProduct(newProduct);
        });

        expect(result.current.products).toHaveLength(2);
        expect(result.current.products[1]).toEqual(newProduct);
      });
    });

    describe('useDiscount > ', () => {
      let anotherMockProducts: Product[] = [...mockProducts];

      beforeEach(() => {
        anotherMockProducts = [...mockProducts];
      });

      test('할인 추가 동작이 제대로 동작해야 한다.', () => {
        const updateProduct = (product: Product) => {
          expect(product.id).toBe('p1');
          expect(product.discounts).toEqual([
            ...anotherMockProducts[0].discounts,
            { quantity: 0, rate: 0 },
          ]);
        };

        const { result } = renderHook(() =>
          useDiscount({
            products: anotherMockProducts,
            updateProduct,
            updateEditingProduct: vi.fn(),
          }),
        );

        act(() => {
          result.current.handlers.handleAddDiscount('p1');
        });
      });

      test('할인 삭제 동작이 제대로 동작해야 한다.', () => {
        const updateProduct = (product: Product) => {
          expect(product.id).toBe('p1');
          expect(product.discounts.length).toBe(0);
        };

        const { result } = renderHook(() =>
          useDiscount({
            products: anotherMockProducts,
            updateProduct,
            updateEditingProduct: vi.fn(),
          }),
        );

        act(() => {
          result.current.handlers.handleRemoveDiscount('p1', 0);
        });
      });

      test('신규할인 수량 업데이트 동작이 제대로 동작해야 한다.', () => {
        const { result } = renderHook(() =>
          useDiscount({
            products: anotherMockProducts,
            updateProduct: vi.fn(),
            updateEditingProduct: vi.fn(),
          }),
        );

        act(() => {
          result.current.handlers.handleUpdateNewDiscountQuantity(10);
        });

        expect(result.current.newDiscount.quantity).toBe(10);
      });

      test('신규할인 할인율 업데이트 동작이 제대로 동작해야 한다.', () => {
        const { result } = renderHook(() =>
          useDiscount({
            products: anotherMockProducts,
            updateProduct: vi.fn(),
            updateEditingProduct: vi.fn(),
          }),
        );

        act(() => {
          result.current.handlers.handleUpdateNewDiscountRate(50);
        });

        expect(result.current.newDiscount.rate).toBe(50);
      });
    });

    describe('useCreateCoupon > ', () => {
      let anotherMockCoupons: Coupon[] = [...mockCoupons];

      beforeEach(() => {
        anotherMockCoupons = [...mockCoupons];
      });

      test('할인 추가 동작이 제대로 동작해야 한다.', () => {
        const { result } = renderHook(() =>
          useCreateCoupon({
            onCouponAdd: vi.fn(),
          }),
        );

        act(() => {
          result.current.handlers.handleUpdateNewCouponName('New Coupon');
          result.current.handlers.handleUpdateNewCouponCode('NEW10');
          result.current.handlers.handleUpdateNewCouponDiscountType(
            'percentage',
          );
          result.current.handlers.handleUpdateNewCouponDiscountValue(10);

          result.current.handlers.handleAddCoupon();
        });

        expect(result.current.newCoupon).toEqual({
          name: '',
          code: '',
          discountType: 'percentage',
          discountValue: 0,
        });
      });

      test('추가될 할인의 이름을 설정할 수 있어야 한다.', () => {
        const { result } = renderHook(() =>
          useCreateCoupon({
            onCouponAdd: vi.fn(),
          }),
        );

        act(() => {
          result.current.handlers.handleUpdateNewCouponName('New Coupon');
        });

        expect(result.current.newCoupon.name).toBe('New Coupon');
      });

      test('추가될 할인의 코드를 설정할 수 있어야 한다.', () => {
        const { result } = renderHook(() =>
          useCreateCoupon({
            onCouponAdd: vi.fn(),
          }),
        );

        act(() => {
          result.current.handlers.handleUpdateNewCouponCode('NEW10');
        });

        expect(result.current.newCoupon.code).toBe('NEW10');
      });

      test('추가될 할인의 타입을 설정할 수 있어야 한다.', () => {
        const { result } = renderHook(() =>
          useCreateCoupon({
            onCouponAdd: vi.fn(),
          }),
        );

        act(() => {
          result.current.handlers.handleUpdateNewCouponDiscountType('amount');
        });

        expect(result.current.newCoupon.discountType).toBe('amount');

        act(() => {
          result.current.handlers.handleUpdateNewCouponDiscountType(
            'percentage',
          );
        });

        expect(result.current.newCoupon.discountType).toBe('percentage');
      });

      test('추가될 할인률을 설정할 수 있어야 한다.', () => {
        const { result } = renderHook(() =>
          useCreateCoupon({
            onCouponAdd: vi.fn(),
          }),
        );

        act(() => {
          result.current.handlers.handleUpdateNewCouponDiscountValue(10);
        });

        expect(result.current.newCoupon.discountValue).toBe(10);
      });
    });

    describe('useCreateProduct > ', () => {
      let anotherMockProducts: Product[] = [...mockProducts];

      beforeEach(() => {
        anotherMockProducts = [...mockProducts];
      });

      test('할인 추가 동작이 제대로 동작해야 한다.', () => {
        const { result } = renderHook(() =>
          useCreateProduct({
            addProduct: (product: Product) => {
              // ID가 숫자로 된 문자열인지 확인
              expect(product.id).toMatch(/^\d+$/); // 숫자만 포함한 문자열인지 확인
              // ID가 현재 시간에 기반해 생성되었는지 범위 확인 (대략적인 검증)
              const now = Date.now();
              const idAsNumber = Number(product.id);
              expect(idAsNumber).toBeGreaterThan(now - 1000); // 1초 이전
              expect(idAsNumber).toBeLessThanOrEqual(now);
              expect(product.name).toBe('New Product');
              expect(product.discounts).toEqual([]);
            },
          }),
        );

        act(() => {
          result.current.handlers.handleUpdateNewProductName('New Product');
          result.current.handlers.handleUpdateNewProductPrice(100);
          result.current.handlers.handleUpdateNewProductStock(10);
        });

        expect(result.current.newProduct).toEqual({
          discounts: [],
          name: 'New Product',
          price: 100,
          stock: 10,
        });
        act(() => {
          result.current.handlers.handleAddNewProduct();
        });
      });

      test('추가될 할인의 이름을 설정할 수 있어야 한다.', () => {
        const { result } = renderHook(() =>
          useCreateCoupon({
            onCouponAdd: vi.fn(),
          }),
        );

        act(() => {
          result.current.handlers.handleUpdateNewCouponName('New Coupon');
        });

        expect(result.current.newCoupon.name).toBe('New Coupon');
      });

      test('추가될 할인의 코드를 설정할 수 있어야 한다.', () => {
        const { result } = renderHook(() =>
          useCreateCoupon({
            onCouponAdd: vi.fn(),
          }),
        );

        act(() => {
          result.current.handlers.handleUpdateNewCouponCode('NEW10');
        });

        expect(result.current.newCoupon.code).toBe('NEW10');
      });

      test('추가될 할인의 타입을 설정할 수 있어야 한다.', () => {
        const { result } = renderHook(() =>
          useCreateCoupon({
            onCouponAdd: vi.fn(),
          }),
        );

        act(() => {
          result.current.handlers.handleUpdateNewCouponDiscountType('amount');
        });

        expect(result.current.newCoupon.discountType).toBe('amount');

        act(() => {
          result.current.handlers.handleUpdateNewCouponDiscountType(
            'percentage',
          );
        });

        expect(result.current.newCoupon.discountType).toBe('percentage');
      });

      test('추가될 할인률을 설정할 수 있어야 한다.', () => {
        const { result } = renderHook(() =>
          useCreateCoupon({
            onCouponAdd: vi.fn(),
          }),
        );

        act(() => {
          result.current.handlers.handleUpdateNewCouponDiscountValue(10);
        });

        expect(result.current.newCoupon.discountValue).toBe(10);
      });
    });
  });
});
