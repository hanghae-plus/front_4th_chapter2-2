import { fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import { act, useState } from 'react';
import { beforeEach, describe, expect, test } from 'vitest';

import { useForm, useLocalStorage } from '@/refactoring/hooks';
import { AdminPage } from '@/refactoring/pages/Admin/AdminPage';
import { useCouponForm } from '@/refactoring/pages/Admin/CouponManagement/components/CouponAddForm/hooks/useCouponForm';
import { useProductForm } from '@/refactoring/pages/Admin/ProductManagement/components/ProductEditor/ProductUpdateForm/hooks/useProductForm';
import { CartPage } from '@/refactoring/pages/Cart/CartPage';
import { useCartLocalStorage } from '@/refactoring/pages/Cart/hooks/useCartLocalStorage';
import type { Coupon, Discount, Product } from '@/types';

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }]
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }]
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }]
  }
];
const mockCoupons: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10
  }
];

const TestAdminPage = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts(prevProducts => prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const handleProductAdd = (newProduct: Product) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  const handleCouponAdd = (newCoupon: Coupon) => {
    setCoupons(prevCoupons => [...prevCoupons, newCoupon]);
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
      fireEvent.change(couponSelect, { target: { value: mockCoupons[1].code } }); // 10% 할인 쿠폰 선택

      // 11. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 169,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 531,000원')).toBeInTheDocument();

      // 12. 다른 할인 쿠폰 적용하기
      fireEvent.change(couponSelect, { target: { value: mockCoupons[0].code } }); // 5000원 할인 쿠폰
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
      expect($product4).toHaveTextContent('15000원');
      expect($product4).toHaveTextContent('재고: 30');

      // 2. 상품 선택 및 수정
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('toggle-button'));
      fireEvent.click(within($product1).getByTestId('modify-button'));

      fireEvent.change(within($product1).getByDisplayValue('20'), { target: { value: '25' } });
      fireEvent.change(within($product1).getByDisplayValue('10000'), { target: { value: '12000' } });
      fireEvent.change(within($product1).getByDisplayValue('상품1'), { target: { value: '수정된 상품1' } });

      fireEvent.click(within($product1).getByText('수정 완료'));

      expect($product1).toHaveTextContent('수정된 상품1');
      expect($product1).toHaveTextContent('12000원');
      expect($product1).toHaveTextContent('재고: 25');

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('modify-button'));

      // 할인 추가
      fireEvent.change(screen.getByPlaceholderText('수량'), { target: { value: '5' } });
      fireEvent.change(screen.getByPlaceholderText('할인율 (%)'), { target: { value: '5' } });
      fireEvent.click(screen.getByText('할인 추가'));

      expect(screen.getByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument();

      // 할인 삭제
      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument();
      expect(screen.getByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument();

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

  describe('useForm > ', () => {
    test('초기 상태로 주어진 값으로 초기화되어야 합니다', () => {
      const initialState = { name: 'John', age: 30 };
      const { result } = renderHook(() => useForm(initialState));

      expect(result.current.value).toEqual(initialState);
    });

    test('값을 올바르게 업데이트해야 합니다', () => {
      const initialState = { name: 'John', age: 30 };
      const { result } = renderHook(() => useForm(initialState));

      act(() => {
        result.current.updateValue('name', 'Doe');
      });

      expect(result.current.value).toEqual({ name: 'Doe', age: 30 });
    });

    test('init이 호출되면 초기 상태로 리셋되어야 합니다', () => {
      const initialState = { name: 'John', age: 30 };
      const { result } = renderHook(() => useForm(initialState));

      act(() => {
        result.current.updateValue('name', 'Doe');
        result.current.init();
      });

      expect(result.current.value).toEqual(initialState);
    });
  });

  describe('useCouponForm > ', () => {
    test('기본 값으로 초기화되어야 한다', () => {
      const { result } = renderHook(() => useCouponForm());

      expect(result.current.editingCoupon).toEqual({
        name: '',
        code: '',
        discountType: 'amount',
        discountValue: 0
      });
    });

    test('이름이 올바르게 업데이트되어야 한다', () => {
      const { result } = renderHook(() => useCouponForm());

      act(() => {
        result.current.updateName('New Coupon Name');
      });

      expect(result.current.editingCoupon.name).toBe('New Coupon Name');
    });

    test('코드가 올바르게 업데이트되어야 한다', () => {
      const { result } = renderHook(() => useCouponForm());

      act(() => {
        result.current.updateCode('NEWCODE123');
      });

      expect(result.current.editingCoupon.code).toBe('NEWCODE123');
    });

    test('할인 유형이 올바르게 업데이트되어야 한다', () => {
      const { result } = renderHook(() => useCouponForm());

      act(() => {
        result.current.updateDiscountType('percentage');
      });

      expect(result.current.editingCoupon.discountType).toBe('percentage');
    });

    test('할인 값이 올바르게 업데이트되어야 한다', () => {
      const { result } = renderHook(() => useCouponForm());

      act(() => {
        result.current.updateDiscountValue(50);
      });

      expect(result.current.editingCoupon.discountValue).toBe(50);
    });
  });

  describe('useProductForm > ', () => {
    const initialProduct: Product = {
      id: '1',
      name: 'Test Product',
      price: 100,
      stock: 10,
      discounts: []
    };

    test('초기 제품 데이터로 올바르게 초기화되어야 한다', () => {
      const { result } = renderHook(() => useProductForm({ initProduct: initialProduct }));
      expect(result.current.editingProduct).toEqual(initialProduct);
    });

    test('제품 이름을 업데이트할 수 있어야 한다', () => {
      const { result } = renderHook(() => useProductForm({ initProduct: initialProduct }));
      act(() => {
        result.current.updateName('Updated Product');
      });
      expect(result.current.editingProduct.name).toBe('Updated Product');
    });

    test('제품 가격을 업데이트할 수 있어야 한다', () => {
      const { result } = renderHook(() => useProductForm({ initProduct: initialProduct }));
      act(() => {
        result.current.updatePrice(200);
      });
      expect(result.current.editingProduct.price).toBe(200);
    });

    test('제품 재고를 업데이트할 수 있어야 한다', () => {
      const { result } = renderHook(() => useProductForm({ initProduct: initialProduct }));
      act(() => {
        result.current.updateStock(20);
      });
      expect(result.current.editingProduct.stock).toBe(20);
    });

    test('제품 할인 정보를 업데이트할 수 있어야 한다', () => {
      const newDiscounts: Discount[] = [{ quantity: 10, rate: 0.1 }];
      const { result } = renderHook(() => useProductForm({ initProduct: initialProduct }));
      act(() => {
        result.current.updateDiscounts(newDiscounts);
      });
      expect(result.current.editingProduct.discounts).toEqual(newDiscounts);
    });
  });

  describe('useLocalStorage > ', () => {
    const key = 'testKey';
    const initialValue = 'initialValue';

    beforeEach(() => {
      window.localStorage.clear();
      vi.spyOn(window, 'alert').mockImplementation(() => {});
    });

    test('값이 저장되어 있지 않으면 초기 값을 반환해야 합니다.', () => {
      const { result } = renderHook(() => useLocalStorage<string>({ key, initialValue }));

      expect(result.current[0]).toBe(initialValue);
    });

    test('값을 저장하고 검색할 수 있어야 합니다.', () => {
      const { result } = renderHook(() => useLocalStorage<string>({ key, initialValue }));

      act(() => {
        result.current[1]('newValue');
      });

      expect(result.current[0]).toBe('newValue');
      expect(localStorage.getItem(key)).toBe(JSON.stringify('newValue'));
    });

    test('localStorage에서 저장되어 있다면, 저장된 값을 가지고 와야 합니다.', () => {
      localStorage.setItem(key, JSON.stringify('storedValue'));

      const { result } = renderHook(() => useLocalStorage<string>({ key, initialValue }));

      expect(result.current[0]).toBe('storedValue');
    });

    test('JSON 파싱 오류를 잘 처리해야 합니다.', () => {
      localStorage.setItem(key, '{');

      const { result } = renderHook(() => useLocalStorage<string>({ key, initialValue }));

      expect(result.current[0]).toBe(initialValue);
      expect(window.alert).toHaveBeenCalled();
    });
  });
});

describe('useCartLocalStorage > ', () => {
  const sampleProduct: Product = { id: '1', name: 'Sample Product', price: 100, stock: 10, discounts: [] };
  const sampleCoupon: Coupon = {
    name: '10% 할인 쿠폰',
    code: 'DISCOUNT10',
    discountType: 'percentage',
    discountValue: 10
  };

  beforeEach(() => {
    window.localStorage.clear();
  });

  test('상품을 장바구니에 추가할 수 있어야 합니다.', () => {
    const { result } = renderHook(() => useCartLocalStorage());

    act(() => {
      result.current.addToCart(sampleProduct);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].product).toEqual(sampleProduct);
  });

  test('이미 존재하는 상품의 수량이 증가해야 합니다.', () => {
    const { result } = renderHook(() => useCartLocalStorage());

    act(() => {
      result.current.addToCart(sampleProduct);
    });

    act(() => {
      result.current.addToCart(sampleProduct);
    });

    expect(result.current.cart[0].quantity).toBe(2);
  });

  test('장바구니에서 상품을 제거할 수 있어야 합니다.', () => {
    const { result } = renderHook(() => useCartLocalStorage());

    act(() => {
      result.current.addToCart(sampleProduct);
    });

    expect(result.current.cart).toHaveLength(1);

    act(() => {
      result.current.removeFromCart(sampleProduct.id);
    });

    expect(result.current.cart).toHaveLength(0);
  });

  test('상품의 수량을 업데이트할 수 있어야 합니다.', () => {
    const { result } = renderHook(() => useCartLocalStorage());

    act(() => {
      result.current.addToCart(sampleProduct);
    });

    act(() => {
      result.current.updateQuantity(sampleProduct.id, 5);
    });

    expect(result.current.cart[0].quantity).toBe(5);
  });

  test('쿠폰을 적용할 수 있어야 합니다.', () => {
    const { result } = renderHook(() => useCartLocalStorage());

    act(() => {
      result.current.applyCoupon(sampleCoupon);
    });

    expect(result.current.selectedCoupon).toEqual(sampleCoupon);
  });

  test('총액이 올바르게 계산되어야 합니다.', () => {
    const { result } = renderHook(() => useCartLocalStorage());

    act(() => {
      result.current.addToCart(sampleProduct);
    });

    act(() => {
      result.current.applyCoupon(sampleCoupon);
    });

    const total = result.current.calculateTotal();
    expect(total).toEqual({
      totalAfterDiscount: 90,
      totalBeforeDiscount: 100,
      totalDiscount: 10
    });
  });
});
