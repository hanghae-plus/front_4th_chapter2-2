import { ChangeEvent, useEffect, useState } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import { CartPage } from '../../refactoring/components/Cart/CartPage.tsx';
import { AdminPage } from '../../refactoring/components/Admin/AdminPage.tsx';
import { Coupon, Product } from '../../types';
import useAdminEditProduct from '../../refactoring/hooks/useAdminEditProduct.ts';
import useAdminNewDiscount from '../../refactoring/hooks/useAdminNewDiscount.ts';
import { useCart, useCouponList, useProductList } from '../../refactoring/hooks';
import { initialNewProduct } from '../../constant.ts';
import useNewProduct from '../../refactoring/hooks/useNewProduct.ts';
import useProductSet from '../../refactoring/hooks/useProductSet.ts';
import useAdminProductList from '../../refactoring/hooks/useAdminProductList.ts';
import {
  addCartItemToCart,
  calculateCartTotal,
  calculateItemTotal,
  getMaxApplicableDiscount,
  getRemainingStock,
  updateCartItemQuantity,
} from '../../refactoring/models/cart.ts';
import { getNewProduct, getNewSet } from '../../refactoring/models/adminProduct.ts';

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discountList: [{ quantity: 10, rate: 0.1 }],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discountList: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discountList: [{ quantity: 10, rate: 0.2 }],
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
/**
 * const TestAdminPage = () => {
 *   const products = JSON.parse(localStorage.getItem('productList')!) as Product[];
 *   const coupons = JSON.parse(localStorage.getItem('couponList')!) as Coupon[];
 *
 *   const handleProductUpdate = (updatedProduct: Product) => {
 *     const mockProductList = JSON.parse(localStorage.getItem('productList')!) as Product[];
 *     localStorage.setItem(
 *       'productList',
 *       JSON.stringify(mockProductList.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))),
 *     );
 *   };
 *
 *   const handleProductAdd = (newProduct: Product) => {
 *     const mockProductList = JSON.parse(localStorage.getItem('productList')!) as Product[];
 *     localStorage.setItem('productList', JSON.stringify([...mockProductList, newProduct]));
 *   };
 *
 *   const handleCouponAdd = (newCoupon: Coupon) => {
 *     const mockCouponList = JSON.parse(localStorage.getItem('couponList')!) as Coupon[];
 *     localStorage.setItem('couponList', JSON.stringify([...mockCouponList, newCoupon]));
 *   };
 *
 *   return (
 *     <AdminPage
 *       productList={products}
 *       couponList={coupons}
 *       onProductUpdate={handleProductUpdate}
 *       onProductAdd={handleProductAdd}
 *       onCouponAdd={handleCouponAdd}
 *     />
 *   );
 * };
 * @constructor
 */

const TestAdminPage = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('productList');
    return savedProducts ? JSON.parse(savedProducts) : mockProducts;
  });
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const savedCoupons = localStorage.getItem('couponList');
    return savedCoupons ? JSON.parse(savedCoupons) : mockCoupons;
  });

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

  useEffect(() => {
    localStorage.setItem('productList', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('couponList', JSON.stringify(coupons));
  }, [coupons]);

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
    beforeEach(() => {
      localStorage.setItem('productList', JSON.stringify(mockProducts));
      localStorage.setItem('couponList', JSON.stringify(mockCoupons));
    });
    test('장바구니 페이지 테스트 > ', async () => {
      render(<CartPage productList={mockProducts} coupons={mockCoupons} />);
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

  // 커스텀 훅 테스트
  describe('useAdminEditProduct 테스트', () => {
    const props = {
      productList: mockProducts,
      onProductUpdate: vi.fn(),
    };
    test('상품 수정 테스트', () => {
      // given
      const { result } = renderHook(() => useAdminEditProduct(props));

      // when
      act(() => {
        result.current.handleEditProduct(mockProducts[0]);
      });

      // then
      expect(result.current.editingProduct).toEqual(mockProducts[0]);
    });

    test('상품명 수정 테스트', () => {
      // given
      const { result } = renderHook(() => useAdminEditProduct(props));

      // when
      act(() => {
        result.current.handleEditProduct(mockProducts[0]);
      });

      act(() => {
        result.current.handleProductNameUpdate('p1', '상품1 수정');
      });

      // then
      expect(result.current.editingProduct).toEqual({
        ...mockProducts[0],
        name: '상품1 수정',
      });
    });

    test('가격 수정 테스트', () => {
      // given
      const { result } = renderHook(() => useAdminEditProduct(props));

      // when
      act(() => {
        result.current.handleEditProduct(mockProducts[0]);
      });

      act(() => {
        result.current.handlePriceUpdate('p1', 15000);
      });

      // then
      expect(result.current.editingProduct).toEqual({
        ...mockProducts[0],
        price: 15000,
      });
    });

    test('재고 수정 테스트', () => {
      // given
      const { result } = renderHook(() => useAdminEditProduct(props));

      // when
      act(() => {
        result.current.handleEditProduct(mockProducts[0]);
      });

      act(() => {
        result.current.handleStockUpdate('p1', 30);
      });

      // then
      expect(result.current.editingProduct).toEqual({
        ...mockProducts[0],
        stock: 30,
      });
    });

    test('할인 삭제 테스트', () => {
      // given
      const { result } = renderHook(() => useAdminEditProduct(props));

      // when
      act(() => {
        result.current.handleEditProduct(mockProducts[0]);
      });

      act(() => {
        result.current.handleRemoveDiscount('p1', 0);
      });

      // then
      expect(result.current.editingProduct).toEqual({
        ...mockProducts[0],
        discountList: [],
      });
    });

    test('수정 완료 테스트', () => {
      // given
      const { result } = renderHook(() => useAdminEditProduct(props));

      // when
      act(() => {
        result.current.handleEditProduct(mockProducts[0]);
      });

      act(() => {
        result.current.handleEditComplete();
      });

      // then
      expect(props.onProductUpdate).toHaveBeenCalledWith(mockProducts[0]);
      expect(result.current.editingProduct).toBeNull();
    });
  });
  describe('useAdminNewDiscount 테스트', () => {
    test('수량 변경 테스트', () => {
      const { result } = renderHook(() => useAdminNewDiscount());
      const value = { target: { value: '5' } } as unknown as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleChangeQuantity(value);
      });

      expect(result.current.newDiscount).toEqual({ quantity: 5, rate: 0 });
    });
    test('할인율 변경 테스트', () => {
      const { result } = renderHook(() => useAdminNewDiscount());
      const value = { target: { value: '10' } } as unknown as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleChangeRate(value);
      });

      expect(result.current.newDiscount).toEqual({ quantity: 0, rate: 0.1 });
    });
    test('할인율 초기화 테스트', () => {
      const { result } = renderHook(() => useAdminNewDiscount());

      act(() => {
        result.current.resetNewDiscount();
      });

      expect(result.current.newDiscount).toEqual({ quantity: 0, rate: 0 });
    });
  });
  describe('useAdminProductList 테스트', () => {
    test('handleAddDiscount 테스트', () => {
      // given
      const onProductUpdate = vi.fn();
      const { result } = renderHook(() =>
        useAdminProductList({ productList: mockProducts, onProductUpdate }),
      );

      const updatedProduct = {
        ...mockProducts[0],
        discountList: [...mockProducts[0].discountList, { quantity: 5, rate: 0.05 }],
      };

      // when
      act(() => {
        result.current.handleEditProduct(mockProducts[0]);
      });

      act(() => {
        result.current.handleChangeQuantity({
          target: { value: '5', type: 'number' },
        } as ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        result.current.handleChangeRate({
          target: { value: '5', type: 'number' },
        } as ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        result.current.handleAddDiscount('p1');
      });

      // then
      expect(onProductUpdate).toHaveBeenCalledWith(updatedProduct);
    });
  });
  describe('useCart 테스트', () => {
    test('상품 추가 테스트', () => {
      // given
      const { result } = renderHook(() => useCart());

      // when
      act(() => {
        result.current.addToCart(mockProducts[0]);
      });

      // then
      expect(result.current.cart).toEqual([{ product: mockProducts[0], quantity: 1 }]);
    });
    test('상품 삭제 테스트', () => {
      // given
      const { result } = renderHook(() => useCart());

      // when
      act(() => {
        result.current.addToCart(mockProducts[0]);
        result.current.addToCart(mockProducts[1]);
        result.current.removeFromCart('p1');
      });

      // then
      expect(result.current.cart).toEqual([{ product: mockProducts[1], quantity: 1 }]);
    });
    test('수량 변경 테스트', () => {
      // given
      const { result } = renderHook(() => useCart());

      // when
      act(() => {
        result.current.addToCart(mockProducts[0]);
        result.current.updateQuantity('p1', 5);
      });

      // then
      expect(result.current.cart).toEqual([{ product: mockProducts[0], quantity: 5 }]);
    });
    test('쿠폰 변경 테스트', () => {
      // given
      const { result } = renderHook(() => useCart());

      // when
      act(() => {
        result.current.applyCoupon(mockCoupons[0]);
      });

      // then
      expect(result.current.selectedCoupon).toEqual(mockCoupons[0]);
    });
  });
  describe('useCoupon 테스트', () => {
    test('쿠폰 추가 테스트', () => {
      // given
      const { result } = renderHook(() => useCouponList([]));

      // when
      act(() => {
        result.current.addCoupon(mockCoupons[0]);
      });

      // then
      expect(result.current.couponList).toEqual([mockCoupons[0]]);
    });
  });
  describe('useNewCoupon 테스트', () => {
    test('쿠폰 변경 테스트', () => {
      // given
      const { result } = renderHook(() => useCouponList([]));

      // when
      act(() => {
        result.current.addCoupon(mockCoupons[0]);
      });

      // then
      expect(result.current.couponList).toEqual([mockCoupons[0]]);
    });
  });
  describe('useNewProduct 테스트', () => {
    test('상품 추가 테스트', () => {
      // given
      const onProductAdd = vi.fn();
      const { result } = renderHook(() => useNewProduct({ onProductAdd }));

      // when
      act(() => {
        result.current.handleAddNewProduct();
      });

      // then
      expect(onProductAdd).toHaveBeenCalledWith({ ...initialNewProduct, id: expect.any(String) });
    });
    test('상품명 변경 테스트', () => {
      // given
      const onProductAdd = vi.fn();
      const { result } = renderHook(() => useNewProduct({ onProductAdd }));

      // when
      act(() => {
        result.current.handleChangeProductName({
          target: { value: '상품1' },
        } as ChangeEvent<HTMLInputElement>);
      });

      // then
      expect(result.current.newProduct).toEqual({ ...initialNewProduct, name: '상품1' });
    });
    test('가격 변경 테스트', () => {
      // given
      const onProductAdd = vi.fn();
      const { result } = renderHook(() => useNewProduct({ onProductAdd }));

      // when
      act(() => {
        result.current.handleChangeProductPrice({
          target: { value: '10000', type: 'number' },
        } as ChangeEvent<HTMLInputElement>);
      });

      // then
      expect(result.current.newProduct).toEqual({ ...initialNewProduct, price: 10000 });
    });
    test('재고 변경 테스트', () => {
      // given
      const onProductAdd = vi.fn();
      const { result } = renderHook(() => useNewProduct({ onProductAdd }));

      // when
      act(() => {
        result.current.handleChangeProductStock({
          target: { value: '20', type: 'number' },
        } as ChangeEvent<HTMLInputElement>);
      });

      // then
      expect(result.current.newProduct).toEqual({ ...initialNewProduct, stock: 20 });
    });
    test('새 상품 폼 토글 테스트', () => {
      // given
      const onProductAdd = vi.fn();
      const { result } = renderHook(() => useNewProduct({ onProductAdd }));

      // when
      act(() => {
        result.current.toggleShowNewProductForm();
      });

      // then
      expect(result.current.showNewProductForm).toBe(true);
    });
  });
  describe('useProductList 테스트', () => {
    test('상품 추가 테스트', () => {
      // given
      const { result } = renderHook(() => useProductList([]));

      // when
      act(() => {
        result.current.addProduct(mockProducts[0]);
      });

      // then
      expect(result.current.productList).toEqual([mockProducts[0]]);
    });
    test('상품 수정 테스트', () => {
      // given
      const { result } = renderHook(() => useProductList(mockProducts));

      // when
      act(() => {
        result.current.updateProduct({ ...mockProducts[0], price: 15000 });
      });

      // then
      expect(result.current.productList).toEqual([
        { ...mockProducts[0], price: 15000 },
        mockProducts[1],
        mockProducts[2],
      ]);
    });
  });
  describe('useProductSet 테스트', () => {
    test('제품 토글 테스트', () => {
      // given
      const { result } = renderHook(() => useProductSet());

      // when
      act(() => {
        result.current.toggleProductAccordion('p1');
      });

      // then
      expect(result.current.openProductIdList).toContain('p1');
    });
  });

  // 계산함수 테스트
  describe('cart 계산 함수 테스트 > ', () => {
    test('calculateItemTotal 테스트', () => {
      // given
      const item = { product: mockProducts[0], quantity: 5 };

      // when
      const result = calculateItemTotal(item);

      // then
      expect(result).toBe(50000);
    });
    test('getMaxApplicableDiscount 테스트', () => {
      // given
      const item = { product: mockProducts[0], quantity: 10 };

      // when
      const result = getMaxApplicableDiscount(item);

      // then
      expect(result).toBe(0.1);
    });
    test('calculateCartTotal 테스트', () => {
      // given
      const cart = [
        { product: mockProducts[0], quantity: 5 },
        { product: mockProducts[1], quantity: 10 },
        { product: mockProducts[2], quantity: 15 },
      ];
      const selectedCoupon = mockCoupons[1];

      // when
      const result = calculateCartTotal(cart, selectedCoupon);

      // then
      expect(result).toEqual({
        totalAfterDiscount: 522000,
        totalBeforeDiscount: 700000,
        totalDiscount: 178000,
      });
    });
    test('updateCartItemQuantity 테스트', () => {
      // given
      const cart = [
        { product: mockProducts[0], quantity: 5 },
        { product: mockProducts[1], quantity: 10 },
        { product: mockProducts[2], quantity: 15 },
      ];

      // when
      const result = updateCartItemQuantity(cart, 'p1', 10);

      // then
      expect(result).toEqual([
        { product: mockProducts[0], quantity: 10 },
        { product: mockProducts[1], quantity: 10 },
        { product: mockProducts[2], quantity: 15 },
      ]);
    });
    test('getRemainingStock 테스트', () => {
      // given
      const product = mockProducts[0];
      const cart = [{ product, quantity: 5 }];

      // when
      const result = getRemainingStock(product, cart);

      // then
      expect(result).toBe(15);
    });
    test('addCartItemToCart 테스트', () => {
      // given
      const product = mockProducts[0];
      const newProduct = mockProducts[1];
      const cart = [{ product, quantity: 5 }];

      // when
      const result = addCartItemToCart(newProduct, cart);

      // then
      expect(result).toEqual([
        { product, quantity: 5 },
        { product: newProduct, quantity: 1 },
      ]);
    });
  });
  describe('adminProduct 계산 함수 테스트 > ', () => {
    test('getNewProduct 테스트', () => {
      // given
      const updatedProduct = mockProducts[0];
      const index = 0;

      // when
      const result = getNewProduct(updatedProduct, index);

      // then
      expect(result).toEqual({
        ...updatedProduct,
        discountList: [],
      });
    });
    test('getNewSet 테스트', () => {
      // given
      const prevSet = new Set(['p1', 'p2']);
      const productId = 'p2';

      // when
      const result = getNewSet(prevSet, productId);

      // then
      expect(result).toEqual(new Set(['p1']));
    });
  });
});
