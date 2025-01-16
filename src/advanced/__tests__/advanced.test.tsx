import { useState } from 'react';
import { describe, expect, test } from 'vitest';
import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import { CartPage } from '../../refactoring/pages/CartPage';
import { AdminPage } from '../../refactoring/pages/AdminPage';
import { Coupon, Product, CartItem } from '../../types';
import { useAppState, useAdminProduct } from '../../refactoring/hooks';
import {
  calculateItemMaxDiscount,
  calculateItemTotal,
  calculateMaxDiscount,
} from '../../refactoring/models/discount';

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
const mockCartItem: CartItem = {
  product: {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 5, rate: 0.1 }, // 5개 이상 구매 시 10% 할인
      { quantity: 10, rate: 0.2 }, // 10개 이상 구매 시 20% 할인
    ],
  },
  quantity: 10,
};

const mockDiscounts = [
  { quantity: 5, rate: 0.1 },
  { quantity: 10, rate: 0.2 },
  { quantity: 15, rate: 0.25 },
];

const TestAdminPage = () => {
  const [productList, setProductList] = useState<Product[]>(mockProducts);
  const [couponList, setCouponList] = useState<Coupon[]>(mockCoupons);

  const handleProductUpdate = (updatedProduct: Product) => {
    setProductList((prevProductList) =>
      prevProductList.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    );
  };

  const handleProductAdd = (newProduct: Product) => {
    setProductList((prevProductList) => [...prevProductList, newProduct]);
  };

  const handleCouponAdd = (newCoupon: Coupon) => {
    setCouponList((prevCouponList) => [...prevCouponList, newCoupon]);
  };

  return (
    <AdminPage
      productList={productList}
      couponList={couponList}
      onProductUpdate={handleProductUpdate}
      onProductAdd={handleProductAdd}
      onCouponAdd={handleCouponAdd}
    />
  );
};

describe('advanced > ', () => {
  describe('시나리오 테스트 > ', () => {
    test('장바구니 페이지 테스트 > ', async () => {
      render(<CartPage productList={mockProducts} couponList={mockCoupons} />);
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

      const $product1 = screen.getByTestId('product-p1');

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText('새 상품 추가'));

      fireEvent.change(screen.getByLabelText('상품명'), { target: { value: '상품4' } });
      fireEvent.change(screen.getByLabelText('가격'), { target: { value: '15000' } });
      fireEvent.change(screen.getByLabelText('재고'), { target: { value: '30' } });

      fireEvent.click(screen.getByText('추가'));

      const $product4 = screen.getByTestId('product-p4');

      expect($product4).toHaveTextContent('상품4');
      expect($product4).toHaveTextContent('15000원');
      expect($product4).toHaveTextContent('재고: 30');

      // 2. 상품 선택 및 수정
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('toggle-button'));
      fireEvent.click(within($product1).getByTestId('modify-button'));

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue('20'), { target: { value: '25' } });
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

  describe('자유롭게 작성해보세요.', () => {
    test('새로운 유틸 함수를 만든 후에 테스트 코드를 작성해서 실행해보세요', () => {
      describe('discount > ', () => {
        test('calculateItemMaxDiscount 장바구니 항목에 대해 올바른 최대 할인율을 반환해야 한다.', () => {
          const discount = calculateItemMaxDiscount(mockCartItem);
          expect(discount).toBe(0.2); // 10개 이상 구매 시 20% 할인 적용
        });

        test('calculateItemTotal 장바구니 항목에 대해 할인 후 총 금액을 올바르게 반환해야 한다.', () => {
          const total = calculateItemTotal(mockCartItem);
          expect(total).toBe(10000 * 10 * (1 - 0.2)); // 10개 구매 시 20% 할인 적용
        });

        test('calculateMaxDiscount 할인 목록에서 최대 할인율을 반환해야 한다.', () => {
          const maxDiscount = calculateMaxDiscount(mockDiscounts);
          expect(maxDiscount).toBe(0.25); // 15개 이상 구매 시 25% 할인 적용
        });

        test('calculateItemMaxDiscount 적용 가능한 할인이 없으면 0을 반환해야 한다.', () => {
          const noDiscountCartItem: CartItem = {
            ...mockCartItem,
            quantity: 3, // 3개 구매 (할인 조건 미충족)
          };
          const discount = calculateItemMaxDiscount(noDiscountCartItem);
          expect(discount).toBe(0); // 할인 조건 미충족 시 0
        });

        test('calculateItemTotal 적용 가능한 할인이 없으면 정가를 반환해야 한다.', () => {
          const noDiscountCartItem: CartItem = {
            ...mockCartItem,
            quantity: 3, // 3개 구매 (할인 조건 미충족)
          };
          const total = calculateItemTotal(noDiscountCartItem);
          expect(total).toBe(10000 * 3); // 할인 조건 미충족 시 정가
        });

        test('calculateMaxDiscount 빈 할인 목록에 대해 0을 반환해야 한다.', () => {
          const maxDiscount = calculateMaxDiscount([]);
          expect(maxDiscount).toBe(0); // 할인 리스트가 비어있으면 0 반환
        });
      });
    });

    test('새로운 hook 함수를 만든 후에 테스트 코드를 작성해서 실행해보세요', () => {
      describe('useAppState > ', () => {
        test('isAdmin 상태를 토글할 수 있어야 한다', () => {
          const { result } = renderHook(() => useAppState());

          act(() => {
            result.current.toggleAdmin();
          });
          expect(result.current.isAdmin).toBe(true);

          act(() => {
            result.current.toggleAdmin();
          });
          expect(result.current.isAdmin).toBe(false);
        });
      });

      describe('useAdminProduct > ', () => {
        const mockOnProductAdd = jest.fn();
        test('초기값이 올바르게 설정되는지 테스트', () => {
          const { result } = renderHook(() => useAdminProduct(mockProducts, mockOnProductAdd));

          expect(result.current.newProduct).toEqual({
            name: '',
            price: 0,
            stock: 0,
            discounts: [],
          });
        });

        test('handleInputChange가 newProduct를 업데이트하는지 테스트', () => {
          const { result } = renderHook(() => useAdminProduct(mockProducts, mockOnProductAdd));

          act(() => {
            result.current.handleInputChange('name', '새 상품');
          });
          expect(result.current.newProduct.name).toBe('새 상품');

          act(() => {
            result.current.handleInputChange('price', 150);
          });
          expect(result.current.newProduct.price).toBe(150);
        });

        test('handleAddNewProduct가 새로운 상품을 추가하고 newProduct를 초기화하는지 테스트', () => {
          const { result } = renderHook(() => useAdminProduct(mockProducts, mockOnProductAdd));

          act(() => {
            result.current.handleInputChange('name', '새 상품');
            result.current.handleInputChange('price', 300);
            result.current.handleInputChange('stock', 20);
          });

          expect(result.current.newProduct).toEqual({
            name: '새 상품',
            price: 300,
            stock: 20,
            discounts: [],
          });

          act(() => {
            result.current.handleAddNewProduct();
          });

          // 새로운 상품이 mockOnProductAdd를 통해 추가되었는지 확인
          expect(mockOnProductAdd).toHaveBeenCalledWith({
            id: 'p3', // mockProductList의 길이에 따라 ID가 부여됨
            name: '새 상품',
            price: 300,
            stock: 20,
            discounts: [],
          });

          // newProduct가 초기값으로 리셋되었는지 확인
          expect(result.current.newProduct).toEqual({
            name: '',
            price: 0,
            stock: 0,
            discounts: [],
          });
        });
      });
    });
  });
});
