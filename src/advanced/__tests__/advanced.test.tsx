import { useState } from 'react';
import { beforeEach, describe, expect, it, test } from 'vitest';
import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import { CartPage } from '../../refactoring/components/CartPage';
import { AdminPage } from '../../refactoring/components/AdminPage';
import { CartItem, Coupon, Discount, Product } from '../../types';
import {
  getAppliedDiscount,
  getMaxDiscount,
  getRemainingStock,
} from '../../refactoring/utils/cart';
import { useOpenProductIds } from '../../refactoring/hooks/useOpenProductIds';
import { useNewProduct } from '../../refactoring/hooks/useNewProduct';
import { useProducts } from '../../refactoring/hooks';
import { useNewCoupon } from '../../refactoring/hooks/useNewCoupon';

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
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
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
      productList={products}
      couponList={coupons}
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

  describe('Custom Hook 테스트 1. useOpenProductIds ( 상품 열기 )', () => {
    // Hook 테스트
    function setupHook() {
      return renderHook(() => useOpenProductIds());
    }

    function testInitialState() {
      const { result } = setupHook();
      expect(result.current.openProductIds.size).toBe(0);
    }

    function testAddProduct() {
      const { result } = setupHook();
      act(() => {
        result.current.toggleProductAccordion('product1');
      });
      expect(result.current.openProductIds.has('product1')).toBe(true);
    }

    function testRemoveProduct() {
      const { result } = setupHook();
      act(() => {
        result.current.toggleProductAccordion('product1');
        result.current.toggleProductAccordion('product1');
      });
      expect(result.current.openProductIds.has('product1')).toBe(false);
    }

    it('초기 상태는 빈 Set이어야 한다', testInitialState);
    it('상품 ID 추가가 정상 동작해야 한다', testAddProduct);
    it('상품 ID 제거가 정상 동작해야 한다', testRemoveProduct);
  });

  describe('Custom Hook 테스트 2. useNewProduct ( 상품 추가 )', () => {
    const mockProductList: Product[] = [
      {
        id: '1',
        name: '기존 상품',
        price: 1000,
        stock: 100,
        discounts: [],
      },
    ];

    function setup() {
      const { result } = renderHook(() => useProducts(mockProductList));
      return { result };
    }

    it('초기 상품 목록이 정상적으로 설정되어야 한다', () => {
      const { result } = setup();

      expect(result.current.productList).toEqual(mockProductList);
    });

    it('상품 추가가 정상적으로 동작해야 한다', () => {
      const { result } = setup();
      const newProduct = {
        id: expect.any(String),
        name: '새 상품',
        price: 2000,
        stock: 50,
        discounts: [],
      };

      act(() => {
        result.current.addProduct(newProduct);
      });

      expect(result.current.productList).toHaveLength(2);
      expect(result.current.productList[1]).toMatchObject({
        name: '새 상품',
        price: 2000,
        stock: 50,
      });
    });

    it('상품 업데이트가 정상적으로 동작해야 한다', () => {
      const { result } = setup();
      const updatedProduct = {
        ...mockProductList[0],
        name: '수정된 상품',
        price: 1500,
      };

      act(() => {
        result.current.updateProduct(updatedProduct);
      });

      expect(result.current.productList[0]).toEqual(updatedProduct);
    });

    it('상품 업데이트 시 ID가 일치하는 상품만 업데이트되어야 한다', () => {
      const { result } = setup();
      const wrongProduct = {
        ...mockProductList[0],
        id: 'wrong-id',
        name: '잘못된 상품',
      };

      act(() => {
        result.current.updateProduct(wrongProduct);
      });

      expect(result.current.productList[0]).toEqual(mockProductList[0]);
    });

    it('여러 상품을 순차적으로 추가할 수 있어야 한다', () => {
      const { result } = setup();
      const newProducts = [
        {
          id: expect.any(String),
          name: '새 상품 1',
          price: 2000,
          stock: 50,
          discounts: [],
        },
        {
          id: expect.any(String),
          name: '새 상품 2',
          price: 3000,
          stock: 30,
          discounts: [],
        },
      ];

      act(() => {
        newProducts.forEach((product) => {
          result.current.addProduct(product);
        });
      });

      expect(result.current.productList).toHaveLength(3);
      expect(result.current.productList[1].name).toBe('새 상품 1');
      expect(result.current.productList[2].name).toBe('새 상품 2');
    });
  });

  describe('Custom Hook 테스트 3. useNewCoupon ( 쿠폰 추가 )', () => {
    function setup() {
      let addedCoupon: Coupon | null = null;
      const onCouponAdd = (coupon: Coupon) => {
        addedCoupon = coupon;
      };

      return {
        addedCoupon,
        ...renderHook(() => useNewCoupon({ onCouponAdd })),
      };
    }

    function createChangeEvent(value: string): React.ChangeEvent<HTMLInputElement> {
      return {
        target: { value },
      } as React.ChangeEvent<HTMLInputElement>;
    }

    function createSelectEvent(value: string): React.ChangeEvent<HTMLSelectElement> {
      return {
        target: { value },
      } as React.ChangeEvent<HTMLSelectElement>;
    }

    it('초기 상태 확인', () => {
      const { result } = setup();

      expect(result.current.newCoupon).toEqual({
        name: '',
        code: '',
        discountType: 'percentage',
        discountValue: 0,
      });
    });

    it('쿠폰명 입력 확인', () => {
      const { result } = setup();

      act(() => {
        result.current.handleAddNewCouponName(createChangeEvent('테스트 쿠폰'));
      });

      expect(result.current.newCoupon.name).toBe('테스트 쿠폰');
    });

    it('쿠폰 코드 입력 확인', () => {
      const { result } = setup();

      act(() => {
        result.current.handleAddNewCouponCode(createChangeEvent('TEST123'));
      });

      expect(result.current.newCoupon.code).toBe('TEST123');
    });

    it('할인 유형 선택 확인', () => {
      const { result } = setup();

      act(() => {
        result.current.handleAddNewCouponDiscountType(createSelectEvent('amount'));
      });

      expect(result.current.newCoupon.discountType).toBe('amount');
    });

    it('할인 값 입력 확인', () => {
      const { result } = setup();

      act(() => {
        result.current.handleAddNewCouponDiscountValue(createChangeEvent('1000'));
      });

      expect(result.current.newCoupon.discountValue).toBe(1000);
    });

    it('쿠폰 추가 전체 프로세스 확인', () => {
      const { result } = renderHook(() => {
        let capturedCoupon: Coupon | null = null;
        const onCouponAdd = (coupon: Coupon) => {
          capturedCoupon = coupon;
        };
        return { capturedCoupon, ...useNewCoupon({ onCouponAdd }) };
      });

      act(() => {
        result.current.handleAddNewCouponName(createChangeEvent('테스트 쿠폰'));
        result.current.handleAddNewCouponCode(createChangeEvent('TEST123'));
        result.current.handleAddNewCouponDiscountType(createSelectEvent('amount'));
        result.current.handleAddNewCouponDiscountValue(createChangeEvent('1000'));
        result.current.handleAddCoupon();
      });

      expect(result.current.newCoupon).toEqual({
        name: '',
        code: '',
        discountType: 'percentage',
        discountValue: 0,
      });
    });
  });

  describe('순수함수 테스트 1. getAppliedDiscount (할인율 계산)', () => {
    const createBaseProduct = (): Product => ({
      id: 'test-product',
      name: 'Test Product',
      price: 10000,
      stock: 100,
      discounts: [],
    });

    const createProductWithDiscounts = (discounts: Discount[]): Product => ({
      ...createBaseProduct(),
      discounts,
    });

    const createCartItem = (product: Product, quantity: number): CartItem => ({
      product,
      quantity,
    });
    // 기본 테스트
    it('할인이 없을 때 0을 반환해야 한다', () => {
      const product = createBaseProduct();
      const cartItem = createCartItem(product, 1);

      expect(getAppliedDiscount(cartItem)).toBe(0);
    });

    // 할인 미달 테스트
    it('수량이 할인 기준치보다 낮을 때 0을 반환해야 한다', () => {
      const discounts = [{ quantity: 3, rate: 10 }];
      const product = createProductWithDiscounts(discounts);
      const cartItem = createCartItem(product, 2);

      expect(getAppliedDiscount(cartItem)).toBe(0);
    });

    // 단일 할인 테스트
    it('수량이 할인 기준치를 충족할 때 할인이 적용되어야 한다', () => {
      const discounts = [{ quantity: 3, rate: 10 }];
      const product = createProductWithDiscounts(discounts);
      const cartItem = createCartItem(product, 3);

      expect(getAppliedDiscount(cartItem)).toBe(10);
    });

    // 다중 할인 테스트
    it('여러 할인이 적용 가능할 때 가장 높은 할인율을 반환해야 한다', () => {
      const discounts = [
        { quantity: 3, rate: 10 },
        { quantity: 5, rate: 20 },
      ];
      const product = createProductWithDiscounts(discounts);
      const cartItem = createCartItem(product, 5);

      expect(getAppliedDiscount(cartItem)).toBe(20);
    });

    // 초과 수량 테스트
    it('수량이 모든 할인 기준치를 초과할 때도 정상적으로 처리되어야 한다', () => {
      const discounts = [
        { quantity: 3, rate: 10 },
        { quantity: 5, rate: 20 },
      ];
      const product = createProductWithDiscounts(discounts);
      const cartItem = createCartItem(product, 10);

      expect(getAppliedDiscount(cartItem)).toBe(20);
    });
  });

  describe('순수함수 테스트 2. getRemainingStock (재고 계산)', () => {
    function testNoCartItem() {
      // 상품에 대한 장바구니 아이템이 없는 경우
      const product: Product = {
        id: 'product1',
        name: '테스트 상품',
        price: 1000,
        stock: 10,
        discounts: [],
      };

      const cartList: CartItem[] = [];

      expect(getRemainingStock(product, cartList)).toBe(10);
    }

    function testWithCartItem() {
      // 상품에 대한 장바구니 아이템이 있는 경우
      const product: Product = {
        id: 'product1',
        name: '테스트 상품',
        price: 1000,
        stock: 10,
        discounts: [],
      };

      const cartList: CartItem[] = [
        {
          product,
          quantity: 3,
        },
      ];

      expect(getRemainingStock(product, cartList)).toBe(7);
    }

    function testWithMultipleCartItems() {
      // 여러 상품이 장바구니에 있는 경우
      const product1: Product = {
        id: 'product1',
        name: '테스트 상품 1',
        price: 1000,
        stock: 10,
        discounts: [],
      };

      const product2: Product = {
        id: 'product2',
        name: '테스트 상품 2',
        price: 2000,
        stock: 20,
        discounts: [],
      };

      const cartList: CartItem[] = [
        { product: product1, quantity: 3 },
        { product: product2, quantity: 5 },
      ];

      expect(getRemainingStock(product1, cartList)).toBe(7);
      expect(getRemainingStock(product2, cartList)).toBe(15);
    }

    it('장바구니에 상품이 없을 때 전체 재고를 반환해야 한다', testNoCartItem);

    it('장바구니에 상품이 있을 때 남은 재고를 정확히 계산해야 한다', testWithCartItem);

    it(
      '여러 상품이 장바구니에 있을 때 특정 상품의 남은 재고를 정확히 계산해야 한다',
      testWithMultipleCartItems,
    );
  });

  describe('순수함수 테스트 3. getMaxDiscount (가장 높은 할인율 구하기)', () => {
    function testEmptyDiscounts() {
      const discounts: { quantity: number; rate: number }[] = [];
      expect(getMaxDiscount(discounts)).toBe(0);
    }

    function testSingleDiscount() {
      const discounts = [{ quantity: 3, rate: 10 }];
      expect(getMaxDiscount(discounts)).toBe(10);
    }

    function testMultipleDiscounts() {
      const discounts = [
        { quantity: 3, rate: 10 },
        { quantity: 5, rate: 20 },
        { quantity: 10, rate: 15 },
      ];
      expect(getMaxDiscount(discounts)).toBe(20);
    }

    function testSameRateDiscounts() {
      const discounts = [
        { quantity: 3, rate: 10 },
        { quantity: 5, rate: 10 },
      ];
      expect(getMaxDiscount(discounts)).toBe(10);
    }

    it('할인이 없을 때 0을 반환해야 한다', testEmptyDiscounts);

    it('단일 할인이 있을 때 해당 할인율을 반환해야 한다', testSingleDiscount);

    it('여러 할인이 있을 때 가장 높은 할인율을 반환해야 한다', testMultipleDiscounts);

    it('동일한 할인율이 여러 개 있을 때 해당 할인율을 반환해야 한다', testSameRateDiscounts);
  });
});
