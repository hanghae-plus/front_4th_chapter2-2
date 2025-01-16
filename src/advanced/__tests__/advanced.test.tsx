import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { AdminPage } from '../../refactoring/domains/admin/AdminPage';
import { CartPage } from '../../refactoring/domains/cart/CartPage';
import { useSearchProduct } from '../../refactoring/domains/cart/hooks/useSearchProduct';
import { useForm, useStorage } from '../../refactoring/hooks';
import { debounce } from '../../refactoring/utils/debounce';
import { formatCurrency } from '../../refactoring/utils/fotmatCurrency';

import type { Coupon, Product } from '../../types';
import type { Mock } from 'vitest';

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

const mockProduct: Product = {
  id: 'p1',
  name: '상품1',
  price: 10000,
  stock: 20,
  discounts: [{ quantity: 10, rate: 0.1 }],
};

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

  describe('debounce', () => {
    test('함수를 호출하면서 전달 된 지연시간 이후에 콜백이 호출되어야 한다.', async () => {
      vi.useFakeTimers();

      const mockCallback = vi.fn();
      const delay = 300;
      const debouncedFunction = debounce(mockCallback, delay);

      debouncedFunction();

      expect(mockCallback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(delay + 100);

      expect(mockCallback).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });
    test('지연시간 내에 호출이 반복된다면 타이머는 초기화 되어야 한다.', async () => {
      vi.useFakeTimers();

      const mockCallback = vi.fn();
      const delay = 300;
      const debouncedFunction = debounce(mockCallback, delay);

      debouncedFunction();
      vi.advanceTimersByTime(150);
      expect(mockCallback).not.toHaveBeenCalled();

      debouncedFunction();
      vi.advanceTimersByTime(200);
      expect(mockCallback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(200);
      expect(mockCallback).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });
  });

  describe('formatCurrency', () => {
    test('기본 원화 포맷팅', () => {
      expect(formatCurrency(1000)).toBe('1,000원');
      expect(formatCurrency(1000000)).toBe('1,000,000원');
      expect(formatCurrency(1234567)).toBe('1,234,567원');
    });

    test('음수 처리', () => {
      expect(formatCurrency(-1000)).toBe('-1,000원');
    });
  });

  describe('useStorage', () => {
    const key = 'testKey';

    beforeEach(() => {
      vi.stubGlobal('localStorage', {
        getItem: vi.fn(),
        setItem: vi.fn(),
        clear: vi.fn(),
      });

      localStorage.clear();
      vi.clearAllMocks();
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    test('VITE_STORAGE_TYPE이 "local"일 때 localStorage 값으로 초기화되어야 한다.', () => {
      vi.stubEnv('VITE_STORAGE_TYPE', 'local');

      (localStorage.getItem as Mock).mockImplementation((key) =>
        key === 'testKey' ? JSON.stringify(mockProduct) : null,
      );

      const { result } = renderHook(() => useStorage(key, mockProduct));

      expect(result.current.item).toEqual(mockProduct);
    });

    test('VITE_STORAGE_TYPE이 "local"일 때 setItem이 호출되면 localStorage와 state가 업데이트되어야 한다.', () => {
      vi.stubEnv('VITE_STORAGE_TYPE', 'local');

      const { result } = renderHook(() => useStorage(key, mockProduct));

      act(() => {
        result.current.setItem({ ...mockProduct, price: 15000 });
      });

      expect(result.current.item).toEqual({ ...mockProduct, price: 15000 });
      expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify({ ...mockProduct, price: 15000 }));
    });

    test('VITE_STORAGE_TYPE이 "local"일 때 updateItem이 호출되면 기존 상태와 병합된 새로운 값으로 state와 localStorage가 업데이트되어야 한다.', () => {
      vi.stubEnv('VITE_STORAGE_TYPE', 'local');

      const { result } = renderHook(() => useStorage(key, mockProduct));

      act(() => {
        result.current.updateItem({ ...mockProduct, price: 15000 });
      });

      expect(result.current.item).toEqual({ ...mockProduct, price: 15000 });
      expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify({ ...mockProduct, price: 15000 }));
    });

    test('VITE_STORAGE_TYPE이 "state"일 때 localStorage를 사용하지 않아야 한다.', () => {
      vi.stubEnv('VITE_STORAGE_TYPE', 'state');

      const { result } = renderHook(() => useStorage(key, mockProduct));

      act(() => {
        result.current.setItem({ ...mockProduct, price: 20000 });
      });

      expect(localStorage.setItem).not.toHaveBeenCalled();
      expect(result.current.item).toEqual({ ...mockProduct, price: 20000 });
    });

    test('VITE_STORAGE_TYPE이 "state"일 때 initialValue로 초기화되어야 한다.', () => {
      vi.stubEnv('VITE_STORAGE_TYPE', 'state');

      const { result } = renderHook(() => useStorage(key, mockProduct));

      expect(result.current.item).toEqual(mockProduct);
    });
  });

  describe('useForm', () => {
    const onSubmitMock = vi.fn();

    test('올바른 초기값이 설정 되어야 한다.', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: mockProduct,
          onSubmit: onSubmitMock,
        }),
      );

      expect(result.current.values).toEqual(mockProduct);
    });

    test('handleChange를 호출하면 Form 상태가 변경 되어야 한다', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: mockProduct,
          onSubmit: onSubmitMock,
        }),
      );

      act(() => {
        result.current.handleChange('price', 15000);
      });

      expect(result.current.values).toEqual({ ...mockProduct, price: 15000 });

      act(() => {
        result.current.handleChange('stock', 100);
      });

      expect(result.current.values).toEqual({ ...mockProduct, price: 15000, stock: 100 });
    });

    test('handleSubmit를 호출하면 onSubmit이 호출되어야 한다.', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: mockProduct,
          onSubmit: onSubmitMock,
        }),
      );

      act(() => {
        result.current.handleChange('price', 15000);
      });

      act(() => {
        result.current.handleSubmit();
      });

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith({
        ...mockProduct,
        price: 15000,
      });
    });

    test('resetForm를 호출하면 초기값으로 상태가 리셋되어야 한다.', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: mockProduct,
          onSubmit: onSubmitMock,
        }),
      );

      act(() => {
        result.current.handleChange('name', '새상품');
      });

      expect(result.current.values).toEqual({
        ...mockProduct,
        name: '새상품',
      });

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.values).toEqual(mockProduct);
    });
  });

  describe('useSearchProducts', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.clearAllTimers();
      vi.useRealTimers();
    });

    test('검색을 하지 않았다면 모든 제품이 표시되어야 한다.', () => {
      const { result } = renderHook(() => useSearchProduct(mockProducts));

      expect(result.current.filteredProducts).toEqual(mockProducts);
    });

    test('검색어에 맞는 제품만 필터링되어야 한다.', () => {
      const { result } = renderHook(() => useSearchProduct(mockProducts));

      act(() => {
        result.current.handleSearch('상품4');
        vi.advanceTimersByTime(300);
      });

      expect(result.current.filteredProducts).toHaveLength(0);

      act(() => {
        result.current.handleSearch('상품1');
        vi.advanceTimersByTime(300);
      });

      expect(result.current.filteredProducts).toHaveLength(1);
      expect(result.current.filteredProducts).toEqual([mockProduct]);
    });
  });
});
