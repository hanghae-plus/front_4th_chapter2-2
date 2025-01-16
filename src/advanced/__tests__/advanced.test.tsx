import { useState } from 'react';
import { beforeEach, describe, expect, it, test, vi } from 'vitest';
import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react';

import { Coupon, Product } from '../../types';
import { useLocalStorage } from '../../refactoring/hooks/useLocalStorage';
import { AdminPage } from '../../refactoring/pages/AdminPage';
import { CartPage } from '../../refactoring/pages/CartPage';

import { validateCoupon } from '../../refactoring/features/coupon/helpers';
import { useForm } from '../../refactoring/hooks/useForm';
import { formatCouponDiscount } from '../../refactoring/features/product/helpers/\bindex';
import { SortOption, useSort } from '../../refactoring/hooks/useSort';
import { formatCurrency } from '../../refactoring/utils/formatCurrency';

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
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts((prevProducts) => prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const handleProductAdd = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleCouponAdd = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return (
    <AdminPage
      products={products}
      coupons={coupons}
      onProductUpdate={handleProductUpdate}
      onProductAdd={handleProductAdd}
      onCouponAdd={handleCouponAdd}
    />
  );
};

describe('advanced > ', () => {
  describe('시나리오 테스트 > ', () => {
    test('장바구니 페이지 테스트 > ', async () => {
      render(<CartPage products={mockProducts} coupons={mockCoupons} />);
      const product1 = screen.getByTestId('product-p1');
      const product2 = screen.getByTestId('product-p2');
      const product3 = screen.getByTestId('product-p3');
      const addToCartButtonsAtProduct1 = within(product1).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct2 = within(product2).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct3 = within(product3).getByText('장바구니에 추가');

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
      const couponSelect = screen.getByTestId('coupon-selector');
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

      fireEvent.change(screen.getByLabelText('상품명'), { target: { value: '상품4' } });
      fireEvent.change(screen.getByLabelText('가격'), { target: { value: '15000' } });
      fireEvent.change(screen.getByLabelText('재고'), { target: { value: '30' } });

      fireEvent.click(screen.getByText('추가'));

      const $product4 = screen.getByTestId('product-4');

      expect($product4).toHaveTextContent('상품4');
      expect($product4).toHaveTextContent('15,000원');
      expect($product4).toHaveTextContent('재고: 30');

      // 2. 상품 선택 및 수정
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('toggle-button'));
      fireEvent.click(within($product1).getByTestId('modify-button'));

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue('20'), { target: { value: '25' } });
        fireEvent.change(within($product1).getByDisplayValue('10000'), { target: { value: '12000' } });
        fireEvent.change(within($product1).getByDisplayValue('상품1'), { target: { value: '수정된 상품1' } });
      });

      fireEvent.click(within($product1).getByText('수정 완료'));

      expect($product1).toHaveTextContent('수정된 상품1');
      expect($product1).toHaveTextContent('12,000원');
      expect($product1).toHaveTextContent('재고: 25');

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('modify-button'));

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('수량'), { target: { value: '5' } });
        fireEvent.change(screen.getByPlaceholderText('할인율 (%)'), { target: { value: '5' } });
      });
      fireEvent.click(screen.getByText('할인 추가'));

      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument();

      // 할인 삭제
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

      const $newCoupon = screen.getByTestId('coupon-3');

      expect($newCoupon).toHaveTextContent('새 쿠폰 (NEW10):10% 할인');
    });
  });

  describe('Hook Test', () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    describe('useForm', () => {
      interface TestForm {
        name: string;
        age: number;
      }

      const initialValues: TestForm = {
        name: '',
        age: 0,
      };

      beforeEach(() => {
        vi.clearAllMocks();
      });

      describe('초기화', () => {
        it('초기값으로 폼이 설정되어야 한다', () => {
          // When
          const { result } = renderHook(() =>
            useForm({
              initialValues,
              onSubmit: vi.fn(),
            }),
          );

          // Then
          expect(result.current.values).toEqual(initialValues);
          expect(result.current.errors).toEqual([]);
          expect(result.current.isValid).toBe(true);
        });
      });

      describe('handleChange', () => {
        it('특정 필드의 값을 변경할 수 있어야 한다', () => {
          // Given
          const { result } = renderHook(() =>
            useForm({
              initialValues,
              onSubmit: vi.fn(),
            }),
          );

          // When
          act(() => {
            result.current.handleChange('name', 'John');
          });

          // Then
          expect(result.current.values.name).toBe('John');
          expect(result.current.errors).toEqual([]);
        });

        it('값 변경시 에러가 초기화되어야 한다', () => {
          // Given
          const validate = vi.fn(() => ({ isValid: false, errors: ['Invalid'] }));
          const { result } = renderHook(() =>
            useForm({
              initialValues,
              validate,
              onSubmit: vi.fn(),
            }),
          );

          // When
          act(() => {
            result.current.handleSubmit();
          });
          act(() => {
            result.current.handleChange('name', 'John');
          });

          // Then
          expect(result.current.errors).toEqual([]);
        });
      });

      describe('handleSubmit', () => {
        it('유효성 검사 없이 제출되어야 한다', () => {
          // Given
          const onSubmit = vi.fn();
          const { result } = renderHook(() =>
            useForm({
              initialValues,
              onSubmit,
            }),
          );

          // When
          act(() => {
            result.current.handleSubmit();
          });

          // Then
          expect(onSubmit).toHaveBeenCalledWith(initialValues);
        });

        it('유효성 검사 실패시 onSubmit이 호출되지 않아야 한다', () => {
          // Given
          const onSubmit = vi.fn();
          const validate = vi.fn(() => ({ isValid: false, errors: ['Invalid'] }));
          const { result } = renderHook(() =>
            useForm({
              initialValues,
              validate,
              onSubmit,
            }),
          );

          // When
          act(() => {
            result.current.handleSubmit();
          });

          // Then
          expect(validate).toHaveBeenCalledWith(initialValues);
          expect(onSubmit).not.toHaveBeenCalled();
          expect(result.current.errors).toEqual(['Invalid']);
        });

        it('유효성 검사 통과시 onSubmit이 호출되어야 한다', () => {
          // Given
          const onSubmit = vi.fn();
          const validate = vi.fn(() => ({ isValid: true, errors: [] }));
          const { result } = renderHook(() =>
            useForm({
              initialValues,
              validate,
              onSubmit,
            }),
          );

          // When
          act(() => {
            result.current.handleSubmit();
          });

          // Then
          expect(validate).toHaveBeenCalledWith(initialValues);
          expect(onSubmit).toHaveBeenCalledWith(initialValues);
          expect(result.current.errors).toEqual([]);
        });

        it('제출 후 폼이 리셋되어야 한다', () => {
          // Given
          const onSubmit = vi.fn();
          const { result } = renderHook(() =>
            useForm({
              initialValues,
              onSubmit,
            }),
          );

          // When
          act(() => {
            result.current.handleChange('name', 'John');
          });
          act(() => {
            result.current.handleSubmit();
          });

          // Then
          expect(result.current.values).toEqual(initialValues);
        });
      });

      describe('resetForm', () => {
        it('폼을 초기 상태로 리셋해야 한다', () => {
          // Given
          const onReset = vi.fn();
          const { result } = renderHook(() =>
            useForm({
              initialValues,
              onSubmit: vi.fn(),
              onReset,
            }),
          );

          // When
          act(() => {
            result.current.handleChange('name', 'John');
          });
          act(() => {
            result.current.resetForm();
          });

          // Then
          expect(result.current.values).toEqual(initialValues);
          expect(result.current.errors).toEqual([]);
          expect(onReset).toHaveBeenCalled();
        });

        it('onReset이 없어도 동작해야 한다', () => {
          // Given
          const { result } = renderHook(() =>
            useForm({
              initialValues,
              onSubmit: vi.fn(),
            }),
          );

          // When & Then
          expect(() =>
            act(() => {
              result.current.resetForm();
            }),
          ).not.toThrow();
        });
      });

      describe('isValid', () => {
        it('에러가 없을 때 true여야 한다', () => {
          // Given
          const { result } = renderHook(() =>
            useForm({
              initialValues,
              onSubmit: vi.fn(),
            }),
          );

          // Then
          expect(result.current.isValid).toBe(true);
        });

        it('에러가 있을 때 false여야 한다', () => {
          // Given
          const validate = vi.fn(() => ({ isValid: false, errors: ['Invalid'] }));
          const { result } = renderHook(() =>
            useForm({
              initialValues,
              validate,
              onSubmit: vi.fn(),
            }),
          );

          // When
          act(() => {
            result.current.handleSubmit();
          });

          // Then
          expect(result.current.isValid).toBe(false);
        });
      });
    });

    describe('useSort >', () => {
      interface TestItem {
        id: string;
        name: string;
        price: number;
        stock: number;
      }

      const testItems: TestItem[] = [
        { id: '1', name: 'B상품', price: 2000, stock: 5 },
        { id: '2', name: 'A상품', price: 1000, stock: 10 },
        { id: '3', name: 'C상품', price: 3000, stock: 8 },
      ];

      const sortOptions: SortOption<TestItem>[] = [
        {
          value: 'name',
          label: '이름순',
          config: {
            key: 'name' as keyof TestItem,
            direction: 'asc',
          },
        },
        {
          value: 'priceAsc',
          label: '가격 낮은순',
          config: {
            key: 'price' as keyof TestItem,
            direction: 'asc',
          },
        },
        {
          value: 'priceDesc',
          label: '가격 높은순',
          config: {
            key: 'price' as keyof TestItem,
            direction: 'desc',
          },
        },
        {
          value: 'custom',
          label: '커스텀 정렬',
          config: {
            key: 'custom',
            direction: 'asc',
            customSort: (a: TestItem, b: TestItem) => a.stock - b.stock,
          },
        },
      ];

      test('초기 정렬이 잘 적용되어야 한다', () => {
        // given
        const defaultSort = 'name';

        // when
        const { result } = renderHook(() => useSort(testItems, sortOptions, defaultSort));

        // then
        expect(result.current.selectedSort).toBe('name');
        expect(result.current.sortedItems[0].name).toBe('A상품');
        expect(result.current.sortedItems[2].name).toBe('C상품');
      });

      test('문자열 기준 정렬이 잘 동작해야 한다', () => {
        // given
        const { result } = renderHook(() => useSort(testItems, sortOptions, 'name'));

        // when
        act(() => {
          result.current.setSelectedSort('name');
        });

        // then
        expect(result.current.sortedItems[0].name).toBe('A상품');
        expect(result.current.sortedItems[1].name).toBe('B상품');
        expect(result.current.sortedItems[2].name).toBe('C상품');
      });

      test('숫자 오름차순 정렬이 잘 동작해야 한다', () => {
        // given
        const { result } = renderHook(() => useSort(testItems, sortOptions, 'name'));

        // when
        act(() => {
          result.current.setSelectedSort('priceAsc');
        });

        // then
        expect(result.current.sortedItems[0].price).toBe(1000);
        expect(result.current.sortedItems[1].price).toBe(2000);
        expect(result.current.sortedItems[2].price).toBe(3000);
      });

      test('숫자 내림차순 정렬이 잘 동작해야 한다', () => {
        // given
        const { result } = renderHook(() => useSort(testItems, sortOptions, 'name'));

        // when
        act(() => {
          result.current.setSelectedSort('priceDesc');
        });

        // then
        expect(result.current.sortedItems[0].price).toBe(3000);
        expect(result.current.sortedItems[1].price).toBe(2000);
        expect(result.current.sortedItems[2].price).toBe(1000);
      });

      test('커스텀 정렬이 잘 동작해야 한다', () => {
        // given
        const { result } = renderHook(() => useSort(testItems, sortOptions, 'name'));

        // when
        act(() => {
          result.current.setSelectedSort('custom');
        });

        // then
        expect(result.current.sortedItems[0].stock).toBe(5);
        expect(result.current.sortedItems[1].stock).toBe(8);
        expect(result.current.sortedItems[2].stock).toBe(10);
      });

      test('존재하지 않는 정렬 옵션을 선택하면 원본 배열을 반환해야 한다', () => {
        // given
        const { result } = renderHook(() => useSort(testItems, sortOptions, 'name'));

        // when
        act(() => {
          result.current.setSelectedSort('nonexistent');
        });

        // then
        expect(result.current.sortedItems).toEqual(testItems);
      });
    });

    describe('useLocalStorage', () => {
      describe('초기 상태 설정', () => {
        it('localStorage가 비어있을 때는 초기값을 사용해야 한다', () => {
          // given
          const key = 'testKey';
          const initialValue = 'initialValue';

          // when
          const { result } = renderHook(() => useLocalStorage(key, initialValue));

          // then
          expect(result.current[0]).toBe(initialValue);
        });

        it('localStorage에 저장된 값이 있을 때는 저장된 값을 사용해야 한다', () => {
          // given
          const key = 'testKey';
          const initialValue = 'initialValue';
          const savedValue = 'savedValue';
          localStorage.setItem(key, JSON.stringify(savedValue));

          // when
          const { result } = renderHook(() => useLocalStorage(key, initialValue));

          // then
          expect(result.current[0]).toBe(savedValue);
        });
      });

      describe('값 업데이트', () => {
        it('새로운 값으로 직접 업데이트할 수 있어야 한다', () => {
          // given
          const key = 'testKey';
          const { result } = renderHook(() => useLocalStorage(key, 'initialValue'));

          // when
          act(() => {
            result.current[1]('newValue');
          });

          // then
          expect(result.current[0]).toBe('newValue');
          expect(JSON.parse(localStorage.getItem(key)!)).toBe('newValue');
        });

        it('함수를 사용하여 이전 값을 기반으로 업데이트할 수 있어야 한다', () => {
          // given
          const key = 'testKey';
          const { result } = renderHook(() => useLocalStorage(key, 'initialValue'));

          // when
          act(() => {
            result.current[1]((prev) => prev + '_updated');
          });

          // then
          expect(result.current[0]).toBe('initialValue_updated');
          expect(JSON.parse(localStorage.getItem(key)!)).toBe('initialValue_updated');
        });
      });

      describe('에러 처리', () => {
        it('잘못된 JSON 형식이 저장되어 있을 때 초기값을 사용해야 한다', () => {
          // given
          const key = 'testKey';
          const initialValue = 'initialValue';
          localStorage.setItem(key, 'invalid-json');
          const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

          // when
          const { result } = renderHook(() => useLocalStorage(key, initialValue));

          // then
          expect(result.current[0]).toBe(initialValue);
          expect(consoleSpy).toHaveBeenCalled();
          consoleSpy.mockRestore();
        });

        it('localStorage 접근이 불가능할 때 초기값을 사용해야 한다', () => {
          // given
          const key = 'testKey';
          const initialValue = 'initialValue';
          const mockError = new Error('localStorage is not available');
          const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
          vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw mockError;
          });

          // when
          const { result } = renderHook(() => useLocalStorage(key, initialValue));

          // then
          expect(result.current[0]).toBe(initialValue);
          expect(consoleSpy).toHaveBeenCalled();
          consoleSpy.mockRestore();
        });
      });
    });
  });

  describe('Util Test', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    describe('formatCouponDiscount', () => {
      describe('금액 할인 쿠폰이 주어졌을 때', () => {
        const coupon: Coupon = {
          name: '신규가입 쿠폰',
          code: 'NEW100',
          discountType: 'amount',
          discountValue: 1000,
        };

        it('원 단위로 표시해야 한다', () => {
          // When
          const result = formatCouponDiscount(coupon);

          // Then
          expect(result).toBe('1000원');
        });
      });

      describe('퍼센트 할인 쿠폰이 주어졌을 때', () => {
        const coupon: Coupon = {
          name: '신규가입 쿠폰',
          code: 'NEW100',
          discountType: 'percentage',
          discountValue: 10,
        };

        it('% 단위로 표시해야 한다', () => {
          // When
          const result = formatCouponDiscount(coupon);

          // Then
          expect(result).toBe('10%');
        });
      });

      describe('할인 값이 0인 쿠폰이 주어졌을 때', () => {
        const amountCoupon: Coupon = {
          name: '테스트 쿠폰',
          code: 'TEST',
          discountType: 'amount',
          discountValue: 0,
        };

        const percentageCoupon: Coupon = {
          name: '테스트 쿠폰',
          code: 'TEST',
          discountType: 'percentage',
          discountValue: 0,
        };

        it('각각의 단위를 표시해야 한다', () => {
          // When
          const amountResult = formatCouponDiscount(amountCoupon);
          const percentageResult = formatCouponDiscount(percentageCoupon);

          // Then
          expect(amountResult).toBe('0원');
          expect(percentageResult).toBe('0%');
        });
      });
    });

    describe('formatCurrency', () => {
      describe('기본 동작 테스트', () => {
        it('옵션 없이 숫자를 한국 원화로 포맷팅한다', () => {
          // given
          const amount = 1000;

          // when
          const result = formatCurrency(amount);

          // then
          expect(result).toBe('₩1,000');
        });
      });

      describe('옵션 처리 테스트', () => {
        it('통화 기호를 숨기는 옵션이 적용된다', () => {
          // given
          const amount = 1000;
          const options = { hideCurrencySymbol: true };

          // when
          const result = formatCurrency(amount, options);

          // then
          expect(result).toBe('1,000');
        });

        it('다른 로케일과 통화로 포맷팅한다', () => {
          // given
          const amount = 1000;
          const options = { locale: 'en-US', currency: 'USD' };

          // when
          const result = formatCurrency(amount, options);

          // then
          expect(result).toBe('$1,000.00');
        });

        it('인도네시아 루피아로 포맷팅한다', () => {
          // given
          const amount = 1000;
          const options = { locale: 'id-ID', currency: 'IDR' };

          // when
          const result = formatCurrency(amount, options);

          // then
          const expected = `Rp${'\u00a0'}1.000`;
          expect(result).toBe(expected);
        });
      });

      describe('잘못된 입력 처리 테스트', () => {
        it('NaN이 입력되면 0을 반환한다', () => {
          // given
          const amount = NaN;

          // when
          const result = formatCurrency(amount);

          // then
          expect(result).toBe('0');
        });

        it('undefined가 입력되면 0을 반환한다', () => {
          // given
          const amount = undefined as any;

          // when
          const result = formatCurrency(amount);

          // then
          expect(result).toBe('0');
        });

        it('null이 입력되면 0을 반환한다', () => {
          // given
          const amount = null as any;

          // when
          const result = formatCurrency(amount);

          // then
          expect(result).toBe('0');
        });
      });

      describe('금액 형식 테스트', () => {
        it('천 단위 구분자가 포함된다', () => {
          // given
          const amount = 1000000;

          // when
          const result = formatCurrency(amount, { hideCurrencySymbol: true });

          // then
          expect(result).toBe('1,000,000');
        });

        it('음수를 처리한다', () => {
          // given
          const amount = -1000;

          // when
          const result = formatCurrency(amount);

          // then
          expect(result).toBe('-₩1,000');
        });

        it('소수점이 있는 숫자를 처리한다', () => {
          // given
          const amount = 1000.5;
          const options = { locale: 'en-US', currency: 'USD' };

          // when
          const result = formatCurrency(amount, options);

          // then
          expect(result).toBe('$1,000.50');
        });
      });
    });

    describe('validateCoupon', () => {
      describe('유효한 쿠폰이 주어졌을 때', () => {
        const validCoupon: Coupon = {
          name: '신규가입 쿠폰',
          code: 'NEW100',
          discountType: 'amount',
          discountValue: 1000,
        };

        it('검증을 통과해야 한다', () => {
          // When
          const result = validateCoupon(validCoupon);

          // Then
          expect(result.isValid).toBe(true);
          expect(result.errors).toHaveLength(0);
        });
      });

      describe('쿠폰 이름이 비어있을 때', () => {
        const coupon: Coupon = {
          name: '',
          code: 'NEW100',
          discountType: 'amount',
          discountValue: 1000,
        };

        it('필수 입력 에러가 발생해야 한다', () => {
          // When
          const result = validateCoupon(coupon);

          // Then
          expect(result.isValid).toBe(false);
          expect(result.errors).toContain('쿠폰 이름은 필수입니다');
        });
      });

      describe('쿠폰 이름이 1글자일 때', () => {
        const coupon: Coupon = {
          name: '쿠',
          code: 'NEW100',
          discountType: 'amount',
          discountValue: 1000,
        };

        it('길이 제한 에러가 발생해야 한다', () => {
          // When
          const result = validateCoupon(coupon);

          // Then
          expect(result.isValid).toBe(false);
          expect(result.errors).toContain('쿠폰 이름은 2글자 이상이어야 합니다');
        });
      });

      describe('쿠폰 코드가 비어있을 때', () => {
        const coupon: Coupon = {
          name: '신규가입 쿠폰',
          code: '',
          discountType: 'amount',
          discountValue: 1000,
        };

        it('필수 입력 에러가 발생해야 한다', () => {
          // When
          const result = validateCoupon(coupon);

          // Then
          expect(result.isValid).toBe(false);
          expect(result.errors).toContain('쿠폰 코드는 필수입니다');
        });
      });

      describe('쿠폰 코드가 영문 대문자와 숫자가 아닌 문자를 포함할 때', () => {
        const coupon: Coupon = {
          name: '신규가입 쿠폰',
          code: 'invalid-code',
          discountType: 'amount',
          discountValue: 1000,
        };

        it('형식 검증 에러가 발생해야 한다', () => {
          // When
          const result = validateCoupon(coupon);

          // Then
          expect(result.isValid).toBe(false);
          expect(result.errors).toContain('쿠폰 코드는 영문 대문자와 숫자만 가능합니다');
        });
      });

      describe('할인 값이 음수일 때', () => {
        const coupon: Coupon = {
          name: '신규가입 쿠폰',
          code: 'NEW100',
          discountType: 'amount',
          discountValue: -1,
        };

        it('값 범위 에러가 발생해야 한다', () => {
          // When
          const result = validateCoupon(coupon);

          // Then
          expect(result.isValid).toBe(false);
          expect(result.errors).toContain('할인 값은 0 이상이어야 합니다');
        });
      });

      describe('퍼센트 할인이 100%를 초과할 때', () => {
        const coupon: Coupon = {
          name: '신규가입 쿠폰',
          code: 'NEW100',
          discountType: 'percentage',
          discountValue: 101,
        };

        it('할인율 범위 에러가 발생해야 한다', () => {
          // When
          const result = validateCoupon(coupon);

          // Then
          expect(result.isValid).toBe(false);
          expect(result.errors).toContain('할인율은 100% 이하여야 합니다');
        });
      });

      describe('금액 할인이 1,000,000원을 초과할 때', () => {
        const coupon: Coupon = {
          name: '신규가입 쿠폰',
          code: 'NEW100',
          discountType: 'amount',
          discountValue: 1000001,
        };

        it('할인 금액 범위 에러가 발생해야 한다', () => {
          // When
          const result = validateCoupon(coupon);

          // Then
          expect(result.isValid).toBe(false);
          expect(result.errors).toContain('할인 금액은 1,000,000원 이하여야 합니다');
        });
      });

      describe('여러 검증 조건을 위반할 때', () => {
        const coupon: Coupon = {
          name: '',
          code: 'invalid-code',
          discountType: 'percentage',
          discountValue: 101,
        };

        it('모든 에러가 수집되어야 한다', () => {
          // When
          const result = validateCoupon(coupon);

          // Then
          expect(result.isValid).toBe(false);
          expect(result.errors).toHaveLength(3);
        });
      });
    });
  });
});
