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
import { CartPage } from '../../refactoring/components/cart/CartPage';
import { AdminPage } from '../../refactoring/components/admin/AdminPage';
import { Coupon, Discount, Product } from '../../types';
import * as utils from '../../refactoring/models';
import {
  useAdminCoupon,
  useAdminEditingProduct,
  useAdminProduct,
} from '../../refactoring/hooks';
import {
  INITIAL_COUPON_STATE,
  INITIAL_DISCOUNT_STATE,
  INITIAL_PRODUCT_STATE,
} from '../../refactoring/data/initialData';

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

  describe('productUtils', () => {
    const testProduct: Product = {
      id: 'p2',
      name: 'Test Product',
      price: 100,
      stock: 10,
      discounts: [
        { quantity: 2, rate: 0.1 },
        { quantity: 5, rate: 0.2 },
      ],
    };

    describe('updateProductList', () => {
      test('업데이트된 제품 리스트를 반환할 수 있다.', () => {
        const updatedProductList = utils.updateProductList(
          mockProducts,
          testProduct,
        );
        expect(updatedProductList[1]).toBe(testProduct);
      });
    });
  });

  describe('couponUtils', () => {
    const testCoupon1: Coupon = {
      name: 'Test Coupon',
      code: 'TEST',
      discountType: 'percentage',
      discountValue: 50,
    };

    const testCoupon2: Coupon = {
      name: 'Test Coupon',
      code: 'TEST',
      discountType: 'amount',
      discountValue: 5000,
    };

    test('5000원 쿠폰을 적용할 수 있다', () => {
      let price = 6000;

      act(() => {
        price = utils.getCouponDiscount(testCoupon2, price);
      });

      expect(price).toBe(1000);
    });

    test('50% 쿠폰을 적용할 수 있다', () => {
      let price = 6000;

      act(() => {
        price = utils.getCouponDiscount(testCoupon1, price);
      });

      expect(price).toBe(3000);
    });

    test('금액이 0보다 작아질 수 없다', () => {
      let price = 3000;

      act(() => {
        price = utils.getCouponDiscount(testCoupon2, price);
      });

      expect(price).toBe(0);
    });
  });

  describe('useAdminCoupon', () => {
    const testCoupon: Coupon = {
      name: 'Test Coupon',
      code: 'TEST',
      discountType: 'percentage',
      discountValue: 10,
    };

    test('쿠폰을 수정할 수 있다.', () => {
      const { result } = renderHook(() => useAdminCoupon());
      act(() => {
        result.current.handleEditCoupon(testCoupon, { name: '변경된 쿠폰' });
      });
      expect(result.current.newCoupon.name).toBe('변경된 쿠폰');
    });

    test('쿠폰을 초기화 할 수 있다.', () => {
      const { result } = renderHook(() => useAdminCoupon());
      act(() => {
        result.current.handleEditCoupon(testCoupon, { name: '변경된 쿠폰' });
        result.current.handleClearCoupon();
      });
      expect(result.current.newCoupon).toEqual(INITIAL_COUPON_STATE);
    });
  });

  describe('useAdminProduct', () => {
    const mockOnProductAdd = vi.fn();
    const mockOnAddSuccess = vi.fn();

    const defaultProps = {
      products: [],
      onProductAdd: mockOnProductAdd,
      onProductUpdate: vi.fn(),
      onAddSuccess: mockOnAddSuccess,
    };

    beforeEach(() => {
      mockOnProductAdd.mockClear();
      mockOnAddSuccess.mockClear();
    });

    test('새 상품을 추가할 수 있다', () => {
      const { result } = renderHook(() => useAdminProduct(defaultProps));

      // 새 상품 정보 설정
      act(() => {
        result.current.setNewProduct({
          ...INITIAL_PRODUCT_STATE,
          name: '테스트 상품',
          price: 15000,
          stock: 100,
        });
      });

      // 상품 추가 함수 호출
      act(() => {
        result.current.handleAddNewProduct();
      });

      // onProductAdd가 호출되었는지 확인
      expect(mockOnProductAdd).toHaveBeenCalledTimes(1);
      // 전달된 상품 데이터 확인
      const addedProduct = mockOnProductAdd.mock.calls[0][0];
      expect(addedProduct.name).toBe('테스트 상품');
      expect(addedProduct.price).toBe(15000);
      expect(addedProduct.stock).toBe(100);
    });

    test('상품 추가 후 newProduct가 초기화된다', () => {
      const { result } = renderHook(() => useAdminProduct(defaultProps));

      // 새 상품 정보 설정
      act(() => {
        result.current.setNewProduct({
          ...INITIAL_PRODUCT_STATE,
          name: '테스트 상품',
        });
      });

      // 상품 추가
      act(() => {
        result.current.handleAddNewProduct();
      });

      // newProduct가 초기 상태로 리셋되었는지 확인
      expect(result.current.newProduct).toEqual(INITIAL_PRODUCT_STATE);
    });

    test('상품 추가 성공 시 onAddSuccess가 호출된다', () => {
      const { result } = renderHook(() => useAdminProduct(defaultProps));

      act(() => {
        result.current.handleAddNewProduct();
      });

      expect(mockOnAddSuccess).toHaveBeenCalledTimes(1);
    });

    test('onAddSuccess가 없어도 상품 추가가 정상적으로 동작한다', () => {
      const propsWithoutCallback = {
        ...defaultProps,
        onAddSuccess: undefined,
      };

      const { result } = renderHook(() =>
        useAdminProduct(propsWithoutCallback),
      );

      act(() => {
        result.current.handleAddNewProduct();
      });

      expect(mockOnProductAdd).toHaveBeenCalledTimes(1);
      expect(result.current.newProduct).toEqual(INITIAL_PRODUCT_STATE);
    });
  });

  describe('useAdminEditingProduct', () => {
    const mockProduct: Product = {
      id: 'test1',
      name: '테스트 상품',
      price: 10000,
      stock: 20,
      discounts: [],
    };

    test('상품 수정을 시작할 수 있다', () => {
      const { result } = renderHook(() => useAdminEditingProduct());

      act(() => {
        result.current.handleEditProduct(mockProduct);
      });

      expect(result.current.editingProduct).toEqual(mockProduct);
    });

    test('상품의 필드를 수정할 수 있다', () => {
      const { result } = renderHook(() => useAdminEditingProduct());

      act(() => {
        result.current.handleEditProduct(mockProduct);
      });

      act(() => {
        result.current.handleFieldUpdate(mockProduct.id, {
          name: '수정된 상품',
          price: 15000,
          stock: 30,
        });
      });

      expect(result.current.editingProduct?.name).toBe('수정된 상품');
      expect(result.current.editingProduct?.price).toBe(15000);
      expect(result.current.editingProduct?.stock).toBe(30);
    });

    test('상품의 할인을 수정할 수 있다', () => {
      const { result } = renderHook(() => useAdminEditingProduct());
      const newDiscount: Discount = { quantity: 5, rate: 0.1 };

      act(() => {
        result.current.handleEditDiscount(newDiscount);
      });

      expect(result.current.newDiscount).toEqual(newDiscount);
    });

    test('상품 수정을 초기화할 수 있다', () => {
      const { result } = renderHook(() => useAdminEditingProduct());

      act(() => {
        result.current.handleEditProduct(mockProduct);
      });

      act(() => {
        result.current.handleClearProduct();
      });

      expect(result.current.editingProduct).toBeNull();
    });

    test('할인 수정을 초기화할 수 있다', () => {
      const { result } = renderHook(() => useAdminEditingProduct());
      const newDiscount: Discount = { quantity: 5, rate: 0.1 };

      act(() => {
        result.current.handleEditDiscount(newDiscount);
      });

      act(() => {
        result.current.handleClearDiscount();
      });

      expect(result.current.newDiscount).toEqual(INITIAL_DISCOUNT_STATE);
    });
  });
});
