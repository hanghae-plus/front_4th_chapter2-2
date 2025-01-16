import { useState } from 'react';
import { beforeEach, describe, expect, it, test, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  within,
} from '@testing-library/react';
import { CartPage } from '../../refactoring/pages/user/CartPage';
import { AdminPage } from '../../refactoring/pages/admin/AdminPage';
import {
  CartItem,
  Coupon,
  Discount,
  Product,
} from '../../refactoring/shared/types/types';
import { useProductStore } from '../../refactoring/entities/product/model/useProductStore';
import {
  calculateMaxDiscount,
  getRemainingStock,
} from '../../refactoring/features/products/lib';
import { getAppliedDiscount } from '../../refactoring/features/cart/lib/discount';
import { useAddProduct } from '../../refactoring/hooks/useAddProduct';
import { useCouponStore } from '../../refactoring/entities/coupon/model/useCouponStore';
import { useForm } from '../../refactoring/hooks/useForm';
import { useEditProduct } from '../../refactoring/hooks/useEditProduct';

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [{ id: '1', quantity: 10, rate: 0.1 }],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ id: '1', quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ id: '1', quantity: 10, rate: 0.2 }],
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
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p,
      ),
    );
  };

  const handleProductAdd = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleCouponAdd = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return <AdminPage />;
};

describe('advanced > ', () => {
  describe('시나리오 테스트 > ', () => {
    beforeEach(() => {
      act(() => {
        useProductStore.getState().setProducts(mockProducts);
        useCouponStore.getState().setCoupons(mockCoupons);
      });
    });

    test('장바구니 페이지 테스트 > ', async () => {
      render(<CartPage />);
      const product1 = screen.getByTestId('product-p1');
      const product2 = screen.getByTestId('product-p2');
      const product3 = screen.getByTestId('product-p3');
      const addToCartButtonsAtProduct1 =
        within(product1).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct2 =
        within(product2).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct3 =
        within(product3).getByText('장바구니에 추가');

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

      await act(async () => {
        fireEvent.click($product1);
      });

      await act(async () => {
        fireEvent.click(within($product1).getByTestId('toggle-button'));
      });

      await act(async () => {
        fireEvent.click(within($product1).getByTestId('modify-button'));
      });

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

  describe('계산 함수 테스트', () => {
    describe('calculateMaxDiscount', () => {
      test('가장 높은 할인율 반환', () => {
        const discounts: Discount[] = [
          { id: '1', quantity: 5, rate: 0.1 },
          { id: '2', quantity: 10, rate: 0.2 },
          { id: '3', quantity: 15, rate: 0.15 },
        ];
        const result = calculateMaxDiscount(discounts);
        expect(result).toBe(0.2);
      });

      test('할인이 없으면 0 반환', () => {
        const discounts: Discount[] = [];
        const result = calculateMaxDiscount(discounts);
        expect(result).toBe(0);
      });
    });

    describe('getRemainingStock', () => {
      let product: Product;
      let cart: CartItem[];

      beforeEach(() => {
        product = {
          id: 'p1',
          name: 'Test Product',
          price: 10000,
          stock: 20,
          discounts: [],
        };

        cart = [
          {
            product: { ...product },
            quantity: 5,
          },
        ];
      });

      test('장바구니에 있는 상품의 남은 재고를 정확히 계산', () => {
        const result = getRemainingStock(product, cart);
        expect(result).toBe(15);
      });

      test('장바구니가 비어 있을 경우 전체 재고를 반환', () => {
        const result = getRemainingStock(product, []);
        expect(result).toBe(20);
      });
    });

    describe('getAppliedDiscount', () => {
      const mockDiscounts: Discount[] = [
        { id: '1', quantity: 5, rate: 0.1 },
        { id: '2', quantity: 10, rate: 0.15 },
        { id: '3', quantity: 15, rate: 0.2 },
      ];

      const mockCartItem: CartItem = {
        product: {
          id: 'p1',
          name: '테스트 상품',
          price: 10000,
          stock: 50,
          discounts: mockDiscounts,
        },
        quantity: 0,
      };

      test('적용 가능한 최대 할인율을 반환해야 함 (수량이 15 이상일 경우)', () => {
        const item = { ...mockCartItem, quantity: 15 };
        const result = getAppliedDiscount(item);
        expect(result).toBe(0.2);
      });

      test('적용 가능한 최대 할인율을 반환해야 함 (수량이 10 이상 15 미만일 경우)', () => {
        const item = { ...mockCartItem, quantity: 10 };
        const result = getAppliedDiscount(item);
        expect(result).toBe(0.15);
      });

      test('적용 가능한 최대 할인율을 반환해야 함 (수량이 5 이상 10 미만일 경우)', () => {
        const item = { ...mockCartItem, quantity: 5 };
        const result = getAppliedDiscount(item);
        expect(result).toBe(0.1);
      });

      test('할인율이 없는 경우 0을 반환해야 함 (수량이 5 미만)', () => {
        const item = { ...mockCartItem, quantity: 4 };
        const result = getAppliedDiscount(item);
        expect(result).toBe(0);
      });

      test('할인 정보가 비어 있을 경우 0을 반환해야 함', () => {
        const item = {
          ...mockCartItem,
          product: { ...mockCartItem.product, discounts: [] },
        };
        const result = getAppliedDiscount(item);
        expect(result).toBe(0);
      });
    });
  });

  describe('useAddProduct 커스텀 훅 테스트', () => {
    const mockAddProduct = vi.fn();

    beforeEach(() => {
      vi.mock('../entities/product/model/initializeNewProduct', () => ({
        initializeNewProduct: vi.fn(() => ({
          name: '',
          price: 0,
          stock: 0,
          discounts: [],
        })),
      }));

      vi.clearAllMocks();
    });

    test('초기값으로 초기화를 할 수 있다.', () => {
      const { result } = renderHook(() =>
        useAddProduct({
          addProduct: mockAddProduct,
        }),
      );

      expect(result.current.newProduct).toEqual({
        name: '',
        price: 0,
        stock: 0,
        discounts: [],
      });
      expect(result.current.showNewProductForm).toBe(false);
    });

    test('새 상품 추가 핸들러가 제대로 동작한다.', () => {
      const { result } = renderHook(() =>
        useAddProduct({
          addProduct: mockAddProduct,
        }),
      );

      // 새 상품 추가 폼 열기
      act(() => {
        result.current.setShowNewProductForm(true);
      });

      expect(result.current.showNewProductForm).toBe(true);

      // 상품 데이터 설정
      act(() => {
        result.current.setNewProduct({
          name: '테스트 상품',
          price: 1000,
          stock: 10,
          discounts: [],
        });
      });

      // 상품 추가
      act(() => {
        result.current.handleAddNewProduct();
      });

      // 모의 함수가 올바르게 호출되었는지 확인
      expect(mockAddProduct).toHaveBeenCalledWith({
        id: expect.any(String), // 유니크 ID 확인
        name: '테스트 상품',
        price: 1000,
        stock: 10,
        discounts: [],
      });

      // 상태 초기화 확인
      expect(result.current.newProduct).toEqual({
        name: '',
        price: 0,
        stock: 0,
        discounts: [],
      });
      expect(result.current.showNewProductForm).toBe(false);
    });
  });

  describe('useEditProduct 커스텀 훅 테스트', () => {
    const mockUpdateProduct = vi.fn();

    const mockProducts: Product[] = [
      {
        id: '1',
        name: '상품1',
        price: 1000,
        stock: 10,
        discounts: [],
      },
      {
        id: '2',
        name: '상품2',
        price: 2000,
        stock: 20,
        discounts: [],
      },
    ];

    beforeEach(() => {
      vi.clearAllMocks();
    });

    test('초기값 확인', () => {
      const { result } = renderHook(() =>
        useEditProduct({
          products: mockProducts,
          updateProduct: mockUpdateProduct,
        }),
      );

      expect(result.current.editingProduct).toBeNull();
    });

    test('selectEditProduct로 상품 선택', () => {
      const { result } = renderHook(() =>
        useEditProduct({
          products: mockProducts,
          updateProduct: mockUpdateProduct,
        }),
      );

      act(() => {
        result.current.selectEditProduct(mockProducts[0]);
      });

      expect(result.current.editingProduct).toEqual(mockProducts[0]);
    });

    test('updateEditingProduct로 상품 업데이트', () => {
      const { result } = renderHook(() =>
        useEditProduct({
          products: mockProducts,
          updateProduct: mockUpdateProduct,
        }),
      );

      act(() => {
        result.current.selectEditProduct(mockProducts[0]);
      });

      const updatedProduct = { ...mockProducts[0], price: 1500 };

      act(() => {
        result.current.updateEditingProduct(updatedProduct);
      });

      expect(mockUpdateProduct).toHaveBeenCalledWith(updatedProduct);
      expect(mockUpdateProduct).toHaveBeenCalledTimes(1);
    });

    test('updateEditingProduct 호출 시 ID가 다른 경우 업데이트되지 않음', () => {
      const { result } = renderHook(() =>
        useEditProduct({
          products: mockProducts,
          updateProduct: mockUpdateProduct,
        }),
      );

      act(() => {
        result.current.selectEditProduct(mockProducts[0]);
      });

      const updatedProduct = { ...mockProducts[1], price: 1500 };

      act(() => {
        result.current.updateEditingProduct(updatedProduct);
      });

      expect(mockUpdateProduct).not.toHaveBeenCalled();
    });

    test('resetEditingProduct로 상태 초기화', () => {
      const { result } = renderHook(() =>
        useEditProduct({
          products: mockProducts,
          updateProduct: mockUpdateProduct,
        }),
      );

      act(() => {
        result.current.selectEditProduct(mockProducts[0]);
      });

      expect(result.current.editingProduct).toEqual(mockProducts[0]);

      act(() => {
        result.current.resetEditingProduct();
      });

      expect(result.current.editingProduct).toBeNull();
    });
  });

  describe('useForm 커스텀 훅 테스트', () => {
    // 테스트 데이터 타입 정의
    interface TestFormValues {
      name: string;
      email: string;
      age: number;
    }

    // 초기값 설정
    const initialValues: TestFormValues = {
      name: '',
      email: '',
      age: 0,
    };

    // onSubmit 함수 모킹
    const mockOnSubmit = vi.fn();

    // 유효성 검사 함수
    const validate = (values: TestFormValues) => {
      const errors: Partial<Record<keyof TestFormValues, string>> = {};
      if (!values.name) errors.name = '이름을 입력하세요.';
      if (!values.email.includes('@'))
        errors.email = '올바른 이메일을 입력하세요.';
      if (values.age < 0) errors.age = '나이는 음수일 수 없습니다.';
      return errors;
    };

    describe('useForm 커스텀 훅 테스트', () => {
      beforeEach(() => {
        vi.clearAllMocks();
      });

      test('초기값이 올바르게 설정된다.', () => {
        const { result } = renderHook(() =>
          useForm({
            initialValues,
            onSubmit: mockOnSubmit,
          }),
        );

        expect(result.current.values).toEqual(initialValues);
        expect(result.current.errors).toEqual({});
        expect(result.current.isSubmitting).toBe(false);
      });

      test('값을 변경하면 values가 업데이트된다.', () => {
        const { result } = renderHook(() =>
          useForm({
            initialValues,
            onSubmit: mockOnSubmit,
          }),
        );

        act(() => {
          result.current.handleChange({
            target: { name: 'name', value: '홍길동' },
          } as React.ChangeEvent<HTMLInputElement>);
        });

        expect(result.current.values.name).toBe('홍길동');
      });

      test('setValue를 호출하면 특정 필드가 업데이트된다.', () => {
        const { result } = renderHook(() =>
          useForm({
            initialValues,
            onSubmit: mockOnSubmit,
          }),
        );

        act(() => {
          result.current.setValue('email', 'test@example.com');
        });

        expect(result.current.values.email).toBe('test@example.com');
      });

      test('유효성 검사 에러를 올바르게 처리한다.', () => {
        const { result } = renderHook(() =>
          useForm({
            initialValues,
            onSubmit: mockOnSubmit,
            validate,
          }),
        );

        act(() => {
          result.current.handleSubmit({
            preventDefault: vi.fn(),
          } as unknown as React.FormEvent);
        });

        expect(result.current.errors).toEqual({
          name: '이름을 입력하세요.',
          email: '올바른 이메일을 입력하세요.',
        });
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });

      test('유효성 검사를 통과하면 onSubmit이 호출된다.', () => {
        const { result } = renderHook(() =>
          useForm({
            initialValues: {
              name: '홍길동',
              email: 'test@example.com',
              age: 25,
            },
            onSubmit: mockOnSubmit,
            validate,
          }),
        );

        act(() => {
          result.current.handleSubmit({
            preventDefault: vi.fn(),
          } as unknown as React.FormEvent);
        });

        expect(result.current.errors).toEqual({});
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: '홍길동',
          email: 'test@example.com',
          age: 25,
        });
      });

      test('resetForm을 호출하면 초기값으로 리셋된다.', () => {
        const { result } = renderHook(() =>
          useForm({
            initialValues,
            onSubmit: mockOnSubmit,
          }),
        );

        act(() => {
          result.current.setValue('name', '홍길동');
        });

        expect(result.current.values.name).toBe('홍길동');

        act(() => {
          result.current.resetForm();
        });

        expect(result.current.values).toEqual(initialValues);
        expect(result.current.errors).toEqual({});
      });
    });
  });
});
