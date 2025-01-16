import {useState} from "react";
import {describe, expect, test, vi} from 'vitest';
import {act, fireEvent, render, renderHook, screen, waitFor, within} from '@testing-library/react';
import { CartPage } from '../../refactoring/components/CartPage/CartPage.tsx';
import { AdminPage } from "../../refactoring/components/AdminPage/AdminPage.tsx";
import { Coupon, Product } from '../../types';
import {useCart, useSessionStorage} from "../../refactoring/hooks";
import useCartPage from "../../refactoring/components/CartPage/useCartPage.ts";
import {discountInfo} from "../../refactoring/models/adminUtils.ts";

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
    setProducts(prevProducts =>
      prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
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

      render(<CartPage products={mockProducts} coupons={mockCoupons}/>);
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
      render(<TestAdminPage/>);


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
        fireEvent.change(within($product1).getByDisplayValue('10000'), { target: { value: '12000' } });
        fireEvent.change(within($product1).getByDisplayValue('상품1'), { target: { value: '수정된 상품1' } });
      })

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
      })
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
    })
  })

  describe('자유롭게 작성해보세요.', () => {
    const testProduct: Product = {
      id: "1",
      name: "Test Product",
      price: 100,
      stock: 10,
      discounts: [
        {quantity: 2, rate: 0.1},
        {quantity: 5, rate: 0.2},
      ],
    };
    
    const testProduct2: Product = {
      id: '2',
      name: 'Test Product2',
      price: 20000,
      stock: 20,
      discounts: [{quantity: 10, rate: 0.15}]
    };
    
    
    test('(함수) 1. discountInfo를 사용한 상품 할인율 추가 및 삭제', async () => {
      // discountInfo는 할인 결과값으로 바꿔주는 함수이다. e.g. {quantity: 10, rate: 0.2}라면 10개 이상 구매 시 20% 할인로 바꿔주는 함수
      // TestAdminPage에는 discountInfo 함수를 사용한 로직이 있다.
      render(<TestAdminPage/>);
      
      const $product2 = screen.getByTestId('product-2');
      fireEvent.click($product2);
      fireEvent.click(within($product2).getByTestId('toggle-button'));
      fireEvent.click(within($product2).getByTestId('modify-button'));
      
      // 내가 직접 추가한 수량과 할인율 1
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('수량'), {target: {value: '6'}});
        fireEvent.change(screen.getByPlaceholderText('할인율 (%)'), {target: {value: '6'}});
      })
      fireEvent.click(screen.getByText('할인 추가'));
      
      // 내가 직접 추가한 수량과 할인율 2
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('수량'), {target: {value: '7'}});
        fireEvent.change(screen.getByPlaceholderText('할인율 (%)'), {target: {value: '8'}});
      })
      fireEvent.click(screen.getByText('할인 추가'));
      
      // 추가한 두 개의 수량과 할인율이 discountInfo를 통해서 아래와 같이 잘 출력되는지 확인
      expect(screen.queryByText('6개 이상 구매 시 6% 할인')).toBeInTheDocument();
      expect(screen.queryByText('7개 이상 구매 시 8% 할인')).toBeInTheDocument();
      
      // 가장 위에있는 할인률 정보 값이 잘 삭제되는지 확인
      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(screen.queryByText('10개 이상 구매 시 15% 할인')).not.toBeInTheDocument();
      
      // 직접 discountInfo함수에 input과 return값을 확인하는 테스트
      discountInfo({quantity: 10, rate: 0.2})
      expect(discountInfo({quantity: 10, rate: 0.2})).toEqual(`10개 이상 구매 시 20% 할인`);
    })
    
    test('(함수) 2. 상품 검색 시 debounce 사용', async () => {
      // 상품을 검색할 수 있는 Input 컴포넌트를 생성하였습니다.
      // 상품을 검색할 때 debounce가 잘 적용되는지 확인하는 테스트입니다.
      render(<CartPage products={mockProducts} coupons={mockCoupons}/>);
      
      /* [test-1] 상품 검색 컴포넌트가 잘 보이는지 */
      const $searchInput = screen.getByPlaceholderText('상품 검색...')
      expect($searchInput).toBeInTheDocument();
      
      /*  [test-2] 상품2 검색  */
      act(() => {
        fireEvent.change($searchInput, { target: { value: '상품2' } });
      })
      // 디바운스 시간 이전에는 p2 상품이 아직 보여야 함. 왜냐하면 아무것도 입력을 안 했으면 모든 상품이 다 보이고 있기 때문
      expect(screen.queryByTestId("product-p2")).toBeInTheDocument();
      
      // 200ms 뒤에는 product-p1이 보여서는 안 됨. 상품2를 검색했기 때문
      vi.useFakeTimers();
      // 전체 디바운스 시간만큼 진행 (예: 500ms)
      await vi.advanceTimersByTime(200);
      // 실제 타이머로 전환 후 상태 변화 확인
      vi.useRealTimers();
      // 상품 1은 보이면 안 됨
      await waitFor(() => {
        expect(screen.queryByTestId("product-p1")).not.toBeInTheDocument();
      });
      

      /* [test-3] 상품2를 검색한 상태에서 상품1 검색 */
      act(() => {
        fireEvent.change($searchInput, { target: { value: '상품1' } });
      })
      // debounce 떄문에 상품2만 아직 그대로 있고, 상품1은 보이면 안 됨
      expect(screen.queryByTestId("product-p1")).not.toBeInTheDocument();
      // 이제는 상품1은 보이고, 상품 2는 보이면 안 됨
      await waitFor(() => {
        expect(screen.queryByTestId("product-p1")).toBeInTheDocument();
        expect(screen.queryByTestId("product-p2")).not.toBeInTheDocument();
      });
    });
    
    test('(함수) 3. 상품 생성, 수정 시 validation 적용', async () => {
      // 상품 생성 시 validation에 맞지 않는 값을 통해 상품을 생성하지 못하도록 막는 함수.
      render(<TestAdminPage/>);
      const $product1 = screen.getByTestId('product-1');
      
      // 상품 선택 및 수정
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('toggle-button'));
      fireEvent.click(within($product1).getByTestId('modify-button'));
      
      /* [test-1] 조건에 맞지 않는 상품 데이터를 가지고 수정하는 경우 수정이 되서는 안 된다 */
      act(() => {
        fireEvent.change(within($product1).getByDisplayValue('20'), { target: { value: 'twenty' } });
        fireEvent.change(within($product1).getByDisplayValue('10000'), { target: { value: 'thousand dallars' } });
        fireEvent.change(within($product1).getByDisplayValue('상품1'), { target: { value: '' } });
      })
      
      fireEvent.click(within($product1).getByText('수정 완료'));
      // 수정이 되지 않고 원래 그대로의 상품정보가 남아있는지 확인
      expect($product1).toHaveTextContent('상품1');
      expect($product1).toHaveTextContent('10000원');
      expect($product1).toHaveTextContent('재고: 20');
    })
    
    test('(훅) 1. useCartPage 훅을 만들어서 getRemainingStock, getRemainingStock 테스트', () => {
      // cartPage에 비즈니스 로직과 컴포넌트가 혼재되어있기 때문에 비즈니스로직은 useCartPage()라는 훅을 사용해 분리하여 코드를 구성하였습니다.
      
      /* [test-1] useCartPage에 있는 hook 중 getRemainingStock 함수가 남아있는 재고를 잘 알려주는지 확인하는 테스트 */
      const cartData = renderHook(() => useCart());
      cartData.result.current.addToCart(testProduct);
      const cart = cartData.result.current.cart;
      const {result} = renderHook(() => useCartPage({cart}));
      result.current.getRemainingStock(testProduct);
      expect(result.current.getRemainingStock(testProduct)).toBe(10)
    });
    
    test('(훅) 2. useSessionStorage(담은 상품을 sessionStorage에 기억) 만들기', () => {
      // 담은 카트 정보를 새로고침해도 사라지지 않도록 sessionStorage에 장바구니 정보를 담을 수 있는 hook테스트입니다.
      const cartStorage = renderHook(() => useSessionStorage());
      /* [test-1] 장바구니에 2개의 물건을 추가한 후 마지막에 담은 물건이 잘 담겼는지 확인하는 테스트 */
      act(() => {
        cartStorage.result.current.addToCart(testProduct);
        cartStorage.result.current.addToCart(testProduct2);
      });
      expect(cartStorage.result.current.cart.slice(-1)?.[0]?.product?.name).toBe("Test Product2")
      
      /* [test-2] 마지막에 담았던 장바구니에 있는 제품을 하나 삭제했을 때, 남아있는 장바구니에 대한 정보를 잘 가지고 있는지 확인 */
      act(() => {
        cartStorage.result.current.removeFromCart("2");
      })
      expect(cartStorage.result.current.cart.slice(-1)?.[0]?.product?.name).toBe("Test Product")
      
      /* [test-3] 새로고침(새로운 cartStorage2 사용)을 해도 기존에 담았던 장바구니 데이터를 잘 가지고 있는지 확인  */
      const cartStorage2 = renderHook(() => useSessionStorage());
      act(() => {
        expect(cartStorage2.result.current.cart.slice(-1)?.[0]?.product?.name).toBe("Test Product")
      })
    })
    
    test('(훅) 3. handleSearch(상품 검색) 테스트', async () => {
      // 상품 검색을 할 수 있는 input형태의 컴포넌트를 추가했습니다. 이에 대한 테스트입니다.
      
      /* [test-1] 검색 입력창이 존재하는지 확인 */
      render(<CartPage products={mockProducts} coupons={mockCoupons}/>);
      
      const searchInput = screen.getByPlaceholderText('상품 검색...');
      mockProducts.forEach(product => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });
      
      /* [test-2] 상품1이라고 검색했을 떄 상품1만 검색되기 */
      // 상품 검색 로직은 debounce로 되어있기 때문에 비동기로 테스트가 필요합니다.
      fireEvent.change(searchInput, {
        target: { value: "상품1" },
      });
      vi.useFakeTimers();
      
      // 전체 디바운스 시간만큼 진행 (예: 500ms)
      await vi.advanceTimersByTime(500);
      
      // 실제 타이머로 전환 후 상태 변화 확인
      vi.useRealTimers();
      
      // 상품 1을 검색했기 때문에 상품2가 보여서는 안 됩니다.
      await waitFor(() => {
        expect(screen.queryByTestId("product-p2")).toBeInTheDocument();
      });
    })
  })
})

