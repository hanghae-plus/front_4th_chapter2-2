/* eslint-disable sonarjs/no-nested-functions */
import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { CartPage } from '../../refactoring/components/CartPage';
import { AdminPage } from '../../refactoring/components/AdminPage';
import { CartItemType, CouponType, DiscountType, ProductType } from '../../refactoring/types';
import { renderHook, act, fireEvent, render, screen, within } from '@testing-library/react';
import { updateProductField, handleAddOrRemoveDiscount } from '../../refactoring/utils/product';
import { useCart, useCoupons, useDiscountCalculator, useProducts } from '../../refactoring/hooks';

const mockProductList: ProductType[] = [
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
const mockCouponList: CouponType[] = [
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
const initialCart: CartItemType[] = [
  {
    product: mockProductList[0],
    quantity: 12,
  },
  {
    product: mockProductList[1],
    quantity: 15,
  },
  {
    product: mockProductList[2],
    quantity: 5,
  },
];

const TestAdminPage = () => {
  const [productList, setProductList] = useState<ProductType[]>(mockProductList);
  const [couponList, setCouponList] = useState<CouponType[]>(mockCouponList);

  const handleProductUpdate = (updatedProduct: ProductType) => {
    setProductList((prevProductList) =>
      prevProductList.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    );
  };

  const handleProductAdd = (newProduct: ProductType) => {
    setProductList((prevProductList) => [...prevProductList, newProduct]);
  };

  const handleCouponAdd = (newCoupon: CouponType) => {
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
      render(<CartPage productList={mockProductList} couponList={mockCouponList} />);
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

  describe('유틸리티 함수 테스트', () => {
    describe('updateProductField 함수', () => {
      test('제품 필드를 정상적으로 업데이트한다', () => {
        const mockProduct: ProductType = {
          id: 'p1',
          name: '상품1',
          price: 10000,
          stock: 20,
          discounts: [],
        };
        const setEditingProduct = vi.fn();

        updateProductField('p1', 'price', 15000, mockProduct, setEditingProduct);

        expect(setEditingProduct).toHaveBeenCalledWith({ ...mockProduct, price: 15000 });
      });

      test('제품이 없으면 아무 작업도 하지 않는다', () => {
        const setEditingProduct = vi.fn();

        updateProductField('p2', 'price', 15000, null, setEditingProduct);

        expect(setEditingProduct).not.toHaveBeenCalled();
      });
    });

    describe('handleAddOrRemoveDiscount 함수', () => {
      test('할인을 정상적으로 추가한다', () => {
        const mockProductList: ProductType[] = [
          {
            id: 'p1',
            name: '상품1',
            price: 10000,
            stock: 20,
            discounts: [],
          },
        ];
        const mockDiscount: DiscountType = { quantity: 5, rate: 0.1 };
        const onProductUpdate = vi.fn();
        const setEditingProduct = vi.fn();

        handleAddOrRemoveDiscount(
          'p1',
          mockDiscount,
          true,
          mockProductList,
          onProductUpdate,
          setEditingProduct,
        );

        expect(onProductUpdate).toHaveBeenCalledWith({
          ...mockProductList[0],
          discounts: [mockDiscount],
        });
        expect(setEditingProduct).toHaveBeenCalledWith({
          ...mockProductList[0],
          discounts: [mockDiscount],
        });
      });

      test('할인을 정상적으로 제거한다', () => {
        const mockDiscount: DiscountType = { quantity: 5, rate: 0.1 };
        const mockProductList: ProductType[] = [
          {
            id: 'p1',
            name: '상품1',
            price: 10000,
            stock: 20,
            discounts: [mockDiscount],
          },
        ];
        const onProductUpdate = vi.fn();
        const setEditingProduct = vi.fn();

        handleAddOrRemoveDiscount(
          'p1',
          mockDiscount,
          false,
          mockProductList,
          onProductUpdate,
          setEditingProduct,
        );

        expect(onProductUpdate).toHaveBeenCalledWith({
          ...mockProductList[0],
          discounts: [],
        });
        expect(setEditingProduct).toHaveBeenCalledWith({
          ...mockProductList[0],
          discounts: [],
        });
      });

      test('제품이 없으면 아무 작업도 하지 않는다', () => {
        const mockDiscount: DiscountType = { quantity: 5, rate: 0.1 };
        const mockProductList: ProductType[] = [];
        const onProductUpdate = vi.fn();
        const setEditingProduct = vi.fn();

        handleAddOrRemoveDiscount(
          'p1',
          mockDiscount,
          true,
          mockProductList,
          onProductUpdate,
          setEditingProduct,
        );

        expect(onProductUpdate).not.toHaveBeenCalled();
        expect(setEditingProduct).not.toHaveBeenCalled();
      });
    });
  });

  describe('훅 테스트', () => {
    describe('useCart 훅', () => {
      const mockProduct: ProductType = {
        id: 'p1',
        name: '상품1',
        price: 10000,
        stock: 20,
        discounts: [{ quantity: 10, rate: 0.1 }],
      };

      test('장바구니에 상품을 추가 한다', () => {
        const { result } = renderHook(() => useCart());

        // 장바구니가 비어있는지 확인
        expect(result.current.cart).toHaveLength(0);
        expect(result.current.calculateTotal().totalDiscount).toBe(0);

        // 상품을 장바구니에 추가
        act(() => {
          result.current.addToCart(mockProduct);
        });

        // 상품이 장바구니에 추가된 후 상태 확인
        expect(result.current.cart).toHaveLength(1);
        expect(result.current.cart[0].product.id).toBe(mockProduct.id);
        expect(result.current.calculateTotal().totalAfterDiscount).toBe(mockProduct.price);
      });

      test('장바구니에서 상품을 삭제한다', () => {
        const { result } = renderHook(() => useCart());

        // 상품을 장바구니에 추가
        act(() => {
          result.current.addToCart(mockProduct);
        });

        // 상품 삭제
        act(() => {
          result.current.removeFromCart(mockProduct.id);
        });

        // 장바구니가 비었는지 확인
        expect(result.current.cart).toHaveLength(0);
        expect(result.current.calculateTotal().totalDiscount).toBe(0);
      });
    });

    describe('useCoupons 훅', () => {
      test('초기 쿠폰 목록과 선택된 쿠폰을 초기화 한다.', () => {
        const { result } = renderHook(() => useCoupons(mockCouponList));

        // 초기 쿠폰 목록 확인
        expect(result.current.couponList).toHaveLength(2);
        expect(result.current.selectedCoupon).toBeNull();
      });

      test('새로운 쿠폰을 추가 한다', () => {
        const { result } = renderHook(() => useCoupons(mockCouponList));

        const newCoupon: CouponType = {
          name: '20% 할인 쿠폰',
          code: 'PERCENT20',
          discountType: 'percentage',
          discountValue: 20,
        };

        // 새로운 쿠폰 추가
        act(() => {
          result.current.addCoupon(newCoupon);
        });

        // 쿠폰 목록에 새로운 쿠폰이 추가된지 확인
        expect(result.current.couponList).toHaveLength(3);
        expect(result.current.couponList[2]).toEqual(newCoupon);
      });

      test('쿠폰 적용', () => {
        const { result } = renderHook(() => useCoupons(mockCouponList));

        // 첫 번째 쿠폰을 선택하여 적용
        act(() => {
          result.current.applyCoupon(mockCouponList[0]);
        });

        // 선택된 쿠폰 확인
        expect(result.current.selectedCoupon).toEqual(mockCouponList[0]);
      });

      test('선택된 쿠폰을 정상적으로 적용한다', () => {
        const { result } = renderHook(() => useCoupons(mockCouponList));

        const newCoupon: CouponType = {
          name: '30% 할인 쿠폰',
          code: 'PERCENT30',
          discountType: 'percentage',
          discountValue: 30,
        };

        // 쿠폰 추가 후 적용
        act(() => {
          result.current.addCoupon(newCoupon);
          result.current.applyCoupon(newCoupon);
        });

        // 쿠폰 목록 및 선택된 쿠폰 상태 확인
        expect(result.current.couponList).toHaveLength(3);
        expect(result.current.selectedCoupon).toEqual(newCoupon);
      });
    });

    describe('useProducts 훅', () => {
      const initialProductList: ProductType[] = [
        {
          id: '1',
          name: 'Product 1',
          price: 100,
          stock: 10,
          discounts: [{ quantity: 2, rate: 10 }],
        },
        {
          id: '2',
          name: 'Product 2',
          price: 200,
          stock: 20,
          discounts: [{ quantity: 3, rate: 15 }],
        },
      ];

      test('초기 제품 목록을 초기화 한다', () => {
        const { result } = renderHook(() => useProducts(initialProductList));

        expect(result.current.productList).toEqual(initialProductList);
      });

      test('제품을 정상적으로 추가한다', () => {
        const { result } = renderHook(() => useProducts(initialProductList));

        const newProduct: ProductType = {
          id: '3',
          name: 'Product 3',
          price: 300,
          stock: 30,
          discounts: [{ quantity: 5, rate: 20 }],
        };

        act(() => {
          result.current.addProduct(newProduct);
        });

        expect(result.current.productList).toHaveLength(3);
        expect(result.current.productList).toContainEqual(newProduct);
      });

      test('제품을 정상적으로 업데이트 한다', () => {
        const { result } = renderHook(() => useProducts(initialProductList));

        const updatedProduct: ProductType = {
          id: '1',
          name: 'Updated Product 1',
          price: 150,
          stock: 15,
          discounts: [{ quantity: 2, rate: 5 }],
        };

        act(() => {
          result.current.updateProduct(updatedProduct);
        });

        expect(result.current.productList).toContainEqual(updatedProduct);
        expect(result.current.productList[0].name).toBe('Updated Product 1');
        expect(result.current.productList[0].price).toBe(150);
      });
    });

    describe('useDiscountCalculator 훅', () => {
      test('장바구니에 담긴 제품에 대해 최대 할인율을 계산한다', () => {
        const { result } = renderHook(() => useDiscountCalculator(initialCart));

        // 첫 번째 제품은 12개 구매로 10% 할인 적용
        expect(result.current.getAppliedDiscount(initialCart[0])).toBe(0.1);

        // 두 번째 제품은 15개 구매로 15% 할인 적용
        expect(result.current.getAppliedDiscount(initialCart[1])).toBe(0.15);

        // 세 번째 제품은 5개 구매로 할인 없음
        expect(result.current.getAppliedDiscount(initialCart[2])).toBe(0);
      });

      test('장바구니에 담긴 제품의 남은 재고를 계산한다', () => {
        const { result } = renderHook(() => useDiscountCalculator(initialCart));

        // 첫 번째 제품의 남은 재고는 20 - 12 = 8개
        expect(result.current.getRemainingStock(mockProductList[0])).toBe(8);

        // 두 번째 제품의 남은 재고는 20 - 15 = 5개
        expect(result.current.getRemainingStock(mockProductList[1])).toBe(5);

        // 세 번째 제품의 남은 재고는 20 - 5 = 15개
        expect(result.current.getRemainingStock(mockProductList[2])).toBe(15);
      });

      test('장바구니에 담긴 제품들의 할인이 변경되었을 때 상태가 업데이트 된다', () => {
        const { result } = renderHook(({ cart }) => useDiscountCalculator(cart), {
          initialProps: { cart: initialCart },
        });

        act(() => {
          result.current.updateDiscounts();
        });

        expect(result.current.appliedDiscounts.get('p1')).toBe(0.1);
        expect(result.current.appliedDiscounts.get('p2')).toBe(0.15);
        expect(result.current.appliedDiscounts.get('p3')).toBe(0);
      });

      test('할인율이 변경되지 않으면 상태가 업데이트되지 않는다', () => {
        const { result } = renderHook(() => useDiscountCalculator(initialCart));

        act(() => {
          result.current.updateDiscounts();
        });

        expect(result.current.appliedDiscounts.get('p1')).toBe(0.1);
        expect(result.current.appliedDiscounts.get('p2')).toBe(0.15);
        expect(result.current.appliedDiscounts.get('p3')).toBe(0);
      });
    });
  });
});
