import { useState } from 'react'
import { describe, expect, test, beforeEach, vi } from 'vitest'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { Coupon, Product, CartItem } from '@/types'
import { useProducts, useCoupons, useCart, useLocalStorage } from '@/refactoring/hooks'
import { CartPage, AdminPage } from '@/refactoring/pages'
import {
  calculateItemTotal,
  getMaxApplicableDiscount,
  calculateCartTotal,
  updateCartItemQuantity,
  getMaxDiscount,
  getRemainingStock,
  getAppliedDiscount,
} from '@/refactoring/utils/cart'
import { formatCouponDiscount, getCouponDisplayText } from '@/refactoring/utils/coupon'
import { formatPrice } from '@/refactoring/utils/common'

// localStorage 모킹 추가
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

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
]
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
]

const TestAdminPage = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons)

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts((prevProducts) => prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
  }

  const handleProductAdd = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct])
  }

  const handleCouponAdd = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon])
  }

  return (
    <AdminPage
      products={products}
      coupons={coupons}
      onProductUpdate={handleProductUpdate}
      onProductAdd={handleProductAdd}
      onCouponAdd={handleCouponAdd}
    />
  )
}

describe('advanced > ', () => {
  // 각 테스트 전에 localStorage 초기화
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })
    localStorageMock.clear()
  })

  describe('시나리오 테스트 > ', () => {
    test('장바구니 페이지 테스트 > ', async () => {
      render(<CartPage products={mockProducts} coupons={mockCoupons} />)
      const product1 = screen.getByTestId('product-p1')
      const product2 = screen.getByTestId('product-p2')
      const product3 = screen.getByTestId('product-p3')
      const addToCartButtonsAtProduct1 = within(product1).getByText('장바구니에 추가')
      const addToCartButtonsAtProduct2 = within(product2).getByText('장바구니에 추가')
      const addToCartButtonsAtProduct3 = within(product3).getByText('장바구니에 추가')

      // 1. 상품 정보 표시
      expect(product1).toHaveTextContent('상품1')
      expect(product1).toHaveTextContent('10,000원')
      expect(product1).toHaveTextContent('재고: 20개')
      expect(product2).toHaveTextContent('상품2')
      expect(product2).toHaveTextContent('20,000원')
      expect(product2).toHaveTextContent('재고: 20개')
      expect(product3).toHaveTextContent('상품3')
      expect(product3).toHaveTextContent('30,000원')
      expect(product3).toHaveTextContent('재고: 20개')

      // 2. 할인 정보 표시
      expect(screen.getByText('10개 이상: 10% 할인')).toBeInTheDocument()

      // 3. 상품1 장바구니에 상품 추가
      fireEvent.click(addToCartButtonsAtProduct1) // 상품1 추가

      // 4. 할인율 계산
      expect(screen.getByText('상품 금액: 10,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 0원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 10,000원')).toBeInTheDocument()

      // 5. 상품 품절 상태로 만들기
      for (let i = 0; i < 19; i++) {
        fireEvent.click(addToCartButtonsAtProduct1)
      }

      // 6. 품절일 때 상품 추가 안 되는지 확인하기
      expect(product1).toHaveTextContent('재고: 0개')
      fireEvent.click(addToCartButtonsAtProduct1)
      expect(product1).toHaveTextContent('재고: 0개')

      // 7. 할인율 계산
      expect(screen.getByText('상품 금액: 200,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 20,000원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 180,000원')).toBeInTheDocument()

      // 8. 상품을 각각 10개씩 추가하기
      fireEvent.click(addToCartButtonsAtProduct2) // 상품2 추가
      fireEvent.click(addToCartButtonsAtProduct3) // 상품3 추가

      const increaseButtons = screen.getAllByText('+')
      for (let i = 0; i < 9; i++) {
        fireEvent.click(increaseButtons[1]) // 상품2
        fireEvent.click(increaseButtons[2]) // 상품3
      }

      // 9. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 110,000원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 590,000원')).toBeInTheDocument()

      // 10. 쿠폰 적용하기
      const couponSelect = screen.getByRole('combobox')
      fireEvent.change(couponSelect, { target: { value: '1' } }) // 10% 할인 쿠폰 선택

      // 11. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 169,000원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 531,000원')).toBeInTheDocument()

      // 12. 다른 할인 쿠폰 적용하기
      fireEvent.change(couponSelect, { target: { value: '0' } }) // 5000원 할인 쿠폰
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 115,000원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 585,000원')).toBeInTheDocument()
    })

    test('관리자 페이지 테스트 > ', async () => {
      render(<TestAdminPage />)

      const $product1 = screen.getByTestId('product-1')

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText('새 상품 추가'))

      fireEvent.change(screen.getByLabelText('상품명'), { target: { value: '상품4' } })
      fireEvent.change(screen.getByLabelText('가격'), { target: { value: '15000' } })
      fireEvent.change(screen.getByLabelText('재고'), { target: { value: '30' } })

      fireEvent.click(screen.getByText('추가'))

      const $product4 = screen.getByTestId('product-4')

      expect($product4).toHaveTextContent('상품4')
      expect($product4).toHaveTextContent('15000원')
      expect($product4).toHaveTextContent('재고: 30')

      // 2. 상품 선택 및 수정
      fireEvent.click($product1)
      fireEvent.click(within($product1).getByTestId('toggle-button'))
      fireEvent.click(within($product1).getByTestId('modify-button'))

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue('20'), { target: { value: '25' } })
        fireEvent.change(within($product1).getByDisplayValue('10000'), { target: { value: '12000' } })
        fireEvent.change(within($product1).getByDisplayValue('상품1'), { target: { value: '수정된 상품1' } })
      })

      fireEvent.click(within($product1).getByText('수정 완료'))

      expect($product1).toHaveTextContent('수정된 상품1')
      expect($product1).toHaveTextContent('12000원')
      expect($product1).toHaveTextContent('재고: 25')

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1)
      fireEvent.click(within($product1).getByTestId('modify-button'))

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('수량'), { target: { value: '5' } })
        fireEvent.change(screen.getByPlaceholderText('할인율 (%)'), { target: { value: '5' } })
      })
      fireEvent.click(screen.getByText('할인 추가'))

      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument()

      // 할인 삭제
      fireEvent.click(screen.getAllByText('삭제')[0])
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument()
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument()

      fireEvent.click(screen.getAllByText('삭제')[0])
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument()
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).not.toBeInTheDocument()

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText('쿠폰 이름'), { target: { value: '새 쿠폰' } })
      fireEvent.change(screen.getByPlaceholderText('쿠폰 코드'), { target: { value: 'NEW10' } })
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'percentage' } })
      fireEvent.change(screen.getByPlaceholderText('할인 값'), { target: { value: '10' } })

      fireEvent.click(screen.getByText('쿠폰 추가'))

      const $newCoupon = screen.getByTestId('coupon-3')

      expect($newCoupon).toHaveTextContent('새 쿠폰 (NEW10):10% 할인')
    })
  })

  describe('자유롭게 작성해보세요.', () => {
    // Common test data setup
    const testProduct: Product = {
      id: 'test1',
      name: '테스트 상품',
      price: 10000,
      stock: 20,
      discounts: [
        { quantity: 3, rate: 0.1 }, // 3개 이상 10% 할인
        { quantity: 5, rate: 0.2 }, // 5개 이상 20% 할인
      ],
    }

    test('cart util - calculateItemTotal과 관련 할인 함수들 테스트', () => {
      // 1. calculateItemTotal 테스트
      const testItem: CartItem = {
        product: {
          id: 'test1',
          name: '테스트 상품',
          price: 10000,
          stock: 20,
          discounts: [
            { quantity: 3, rate: 0.1 }, // 3개 이상 10% 할인
            { quantity: 5, rate: 0.2 }, // 5개 이상 20% 할인
          ],
        },
        quantity: 5,
      }

      expect(calculateItemTotal(testItem)).toBe(40000) // 10000 * 5 * (1 - 0.2)

      // 2. getMaxApplicableDiscount 테스트
      // 수량별 최대 할인율 테스트
      const testCases = [
        { quantity: 1, expected: 0 }, // 할인 없음
        { quantity: 3, expected: 0.1 }, // 10% 할인
        { quantity: 5, expected: 0.2 }, // 20% 할인
      ]

      testCases.forEach(({ quantity, expected }) => {
        const item: CartItem = { ...testItem, quantity }
        expect(getMaxApplicableDiscount(item)).toBe(expected)
      })
    })

    test('cart util - calculateCartTotal과 쿠폰 적용 테스트', () => {
      const cart: CartItem[] = [
        {
          product: {
            id: 'test1',
            name: '상품1',
            price: 10000,
            stock: 20,
            discounts: [{ quantity: 3, rate: 0.1 }],
          },
          quantity: 3,
        },
        {
          product: {
            id: 'test2',
            name: '상품2',
            price: 20000,
            stock: 20,
            discounts: [{ quantity: 2, rate: 0.2 }],
          },
          quantity: 2,
        },
      ]

      // 금액 할인 쿠폰
      const amountCoupon: Coupon = {
        name: '5000원 할인',
        code: 'AMOUNT5000',
        discountType: 'amount',
        discountValue: 5000,
      }

      const totalWithAmountCoupon = calculateCartTotal(cart, amountCoupon)
      expect(totalWithAmountCoupon.totalBeforeDiscount).toBe(70000) // (10000 * 3) + (20000 * 2)
      expect(totalWithAmountCoupon.totalDiscount).toBe(16000) // (10000 * 3 * 0.1) + (20000 * 2 * 0.2) + 5000
      expect(totalWithAmountCoupon.totalAfterDiscount).toBe(54000)

      // 비율 할인 쿠폰
      const percentageCoupon: Coupon = {
        name: '10% 할인',
        code: 'PERCENT10',
        discountType: 'percentage',
        discountValue: 10,
      }

      const totalWithPercentageCoupon = calculateCartTotal(cart, percentageCoupon)
      expect(totalWithPercentageCoupon.totalBeforeDiscount).toBe(70000)
      expect(totalWithPercentageCoupon.totalDiscount).toBe(16900) // (10000 * 3 * 0.1) + (20000 * 2 * 0.2) + (59000 * 0.1)
      expect(totalWithPercentageCoupon.totalAfterDiscount).toBe(53100)
    })

    test('cart util - updateCartItemQuantity 테스트', () => {
      const cart: CartItem[] = [
        {
          product: testProduct,
          quantity: 3,
        },
        {
          product: {
            id: 'test2',
            name: '상품2',
            price: 20000,
            stock: 20,
            discounts: [{ quantity: 2, rate: 0.2 }],
          },
          quantity: 2,
        },
      ]

      const updatedCart = updateCartItemQuantity(cart, 'test1', 4)
      expect(updatedCart[0].quantity).toBe(4)
      expect(updatedCart[1].quantity).toBe(2)

      // 수량 0으로 설정시 상품 제거 테스트
      const removedItemCart = updateCartItemQuantity(cart, 'test1', 0)
      expect(removedItemCart.length).toBe(1)
      expect(removedItemCart[0].product.id).toBe('test2')

      // 최대 재고 초과시 테스트
      const maxStockCart = updateCartItemQuantity(cart, 'test1', 30)
      expect(maxStockCart[0].quantity).toBe(20) // stock이 20이므로 20으로 제한됨
    })

    test('cart util - getMaxDiscount 테스트', () => {
      expect(getMaxDiscount(testProduct.discounts)).toBe(0.2)
      expect(getMaxDiscount([])).toBe(0) // 할인 없는 경우
    })

    test('cart util - getRemainingStock 테스트', () => {
      const cart: CartItem[] = [{ product: testProduct, quantity: 5 }]

      expect(getRemainingStock(testProduct, cart)).toBe(15) // 20 - 5 = 15
      expect(getRemainingStock(testProduct, [])).toBe(20) // 장바구니에 없는 경우

      // 다른 상품이 장바구니에 있는 경우
      const otherProduct = { ...testProduct, id: 'test2' }
      expect(getRemainingStock(otherProduct, cart)).toBe(20)
    })

    test('cart util - getAppliedDiscount 테스트', () => {
      const testCases = [
        { quantity: 1, expected: 0 }, // 할인 없음
        { quantity: 3, expected: 0.1 }, // 10% 할인
        { quantity: 4, expected: 0.1 }, // 10% 할인
        { quantity: 5, expected: 0.2 }, // 20% 할인
        { quantity: 10, expected: 0.2 }, // 20% 할인
      ]

      testCases.forEach(({ quantity, expected }) => {
        const cartItem: CartItem = {
          product: testProduct,
          quantity,
        }
        expect(getAppliedDiscount(cartItem)).toBe(expected)
      })

      // 할인 정책이 없는 경우
      const noDiscountProduct: Product = {
        ...testProduct,
        discounts: [],
      }
      expect(getAppliedDiscount({ product: noDiscountProduct, quantity: 5 })).toBe(0)
    })

    test('cart util - getMaxApplicableDiscount 테스트', () => {
      const testCases = [
        { quantity: 1, expected: 0 }, // 할인 기준 미달
        { quantity: 3, expected: 0.1 }, // 첫 번째 할인율 적용
        { quantity: 4, expected: 0.1 }, // 첫 번째 할인율 유지
        { quantity: 5, expected: 0.2 }, // 두 번째 할인율로 상승
        { quantity: 10, expected: 0.2 }, // 최대 할인율 유지
      ]

      testCases.forEach(({ quantity, expected }) => {
        const cartItem: CartItem = {
          product: testProduct,
          quantity,
        }
        expect(getMaxApplicableDiscount(cartItem)).toBe(expected)
      })

      // 할인이 없는 상품 테스트
      const noDiscountItem: CartItem = {
        product: { ...testProduct, discounts: [] },
        quantity: 5,
      }
      expect(getMaxApplicableDiscount(noDiscountItem)).toBe(0)
    })

    test('coupon util - formatCouponDiscount 테스트', () => {
      const amountCoupon: Coupon = {
        name: '5000원 할인',
        code: 'AMOUNT5000',
        discountType: 'amount',
        discountValue: 5000,
      }

      const percentageCoupon: Coupon = {
        name: '10% 할인',
        code: 'PERCENT10',
        discountType: 'percentage',
        discountValue: 10,
      }

      expect(formatCouponDiscount(amountCoupon)).toBe('5000원')
      expect(formatCouponDiscount(percentageCoupon)).toBe('10%')
    })

    test('coupon util - getCouponDisplayText 테스트', () => {
      const testCoupon: Coupon = {
        name: '테스트 쿠폰',
        code: 'TEST',
        discountType: 'amount',
        discountValue: 1000,
      }

      expect(getCouponDisplayText(testCoupon)).toBe('테스트 쿠폰 - 1000원')
    })

    test('common util - formatPrice 테스트', () => {
      const testCases = [
        { input: 1000, expected: '1,000원' },
        { input: 1000000, expected: '1,000,000원' },
        { input: 0, expected: '0원' },
      ]

      testCases.forEach(({ input, expected }) => {
        expect(formatPrice(input)).toBe(expected)
      })
    })

    describe('Coupons 훅 테스트', () => {
      test('useCoupons 기본 기능 테스트', () => {
        const { result: couponsResult } = renderHook(() => useCoupons(mockCoupons))

        // 쿠폰 추가 테스트
        act(() => {
          couponsResult.current.addCoupon({
            name: '신규 쿠폰',
            code: 'NEW15',
            discountType: 'percentage',
            discountValue: 15,
          })
        })
        expect(couponsResult.current.coupons).toHaveLength(3)
      })
    })

    describe('Cart 훅 테스트', () => {
      test('useCart 기본 기능 테스트', () => {
        const { result: cartResult } = renderHook(() => useCart())

        // 장바구니에 상품 추가
        act(() => {
          cartResult.current.addToCart(mockProducts[0])
        })
        expect(cartResult.current.cart).toHaveLength(1)
        expect(cartResult.current.cart[0].product.id).toBe('p1')
        expect(cartResult.current.cart[0].quantity).toBe(1)

        // 수량 업데이트
        act(() => {
          cartResult.current.updateQuantity(mockProducts[0].id, 3)
        })
        expect(cartResult.current.cart[0].quantity).toBe(3)

        // 쿠폰 적용
        act(() => {
          cartResult.current.applyCoupon(mockCoupons[0])
        })
        expect(cartResult.current.selectedCoupon).toBe(mockCoupons[0])

        // 총액 계산
        expect(cartResult.current.cart[0].product.price * cartResult.current.cart[0].quantity).toBe(30000)
      })
    })

    describe('LocalStorage 훅 테스트', () => {
      test('기본 기능 테스트', () => {
        const { result: basicResult } = renderHook(() => useLocalStorage({ key: 'testKey', initialValue: 'test' }))
        expect(basicResult.current[0]).toBe('test')

        // 값 업데이트 테스트
        act(() => {
          basicResult.current[1]('updated')
        })
        expect(basicResult.current[0]).toBe('updated')
      })

      test('객체 데이터 저장 테스트', () => {
        const testObject = { name: 'test', value: 123 }
        const { result: objectResult } = renderHook(() =>
          useLocalStorage({
            key: 'objectKey',
            initialValue: testObject,
          }),
        )
        expect(objectResult.current[0]).toEqual(testObject)
      })

      test('저장된 데이터 불러오기 테스트', () => {
        localStorageMock.getItem.mockReturnValue(JSON.stringify('savedValue'))
        const { result: loadResult } = renderHook(() => useLocalStorage({ key: 'loadKey', initialValue: 'initial' }))
        expect(loadResult.current[0]).toBe('savedValue')
      })

      test('에러 처리 테스트', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        localStorageMock.getItem.mockImplementation(() => {
          throw new Error('localStorage error')
        })

        const { result: errorResult } = renderHook(() => useLocalStorage({ key: 'errorKey', initialValue: 'fallback' }))
        expect(errorResult.current[0]).toBe('fallback')
        expect(consoleErrorSpy).toHaveBeenCalled()

        consoleErrorSpy.mockRestore()
      })
    })

    test('Product 훅 테스트', () => {
      const { result } = renderHook(() => useProducts(mockProducts))

      // 초기 상품 목록 확인
      expect(result.current.products).toEqual(mockProducts)

      // 상품 추가 테스트
      const newProduct: Product = {
        id: 'new1',
        name: '새로운 상품',
        price: 15000,
        stock: 30,
        discounts: [],
      }

      act(() => {
        result.current.addProduct(newProduct)
      })

      expect(result.current.products).toHaveLength(mockProducts.length + 1)
      expect(result.current.products).toContainEqual(newProduct)

      // 상품 업데이트 테스트
      const updatedProduct = {
        ...mockProducts[0],
        price: 12000,
      }

      act(() => {
        result.current.updateProduct(updatedProduct)
      })

      expect(result.current.products[0].price).toBe(12000)
      expect(result.current.products.find((p) => p.id === updatedProduct.id)?.price).toBe(12000)
    })
  })
})
