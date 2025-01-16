import { useState } from "react";
import { describe, expect, it, test } from "vitest";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  within,
} from "@testing-library/react";
import { CartPage } from "../../refactoring/components/CartPage";
import { AdminPage } from "../../refactoring/components/AdminPage";
import { CartItem, Coupon, Product } from "../../types";
import { ProductsProvider } from "../../refactoring/contexts/ProductsContext";
import { toggleProductInSet } from "../../refactoring/models/product";
import {
  calculateCartTotal,
  calculateItemTotal,
  getAppliedDiscount,
  getMaxApplicableDiscount,
  getMaxDiscount,
  getRemainingStock,
  updateCartItemQuantity,
} from "../../refactoring/models/cart";
import { useOpenProductIds } from "../../refactoring/hooks/useOpenProductIds";
import { useNewCoupon } from "../../refactoring/hooks/useNewCoupon";
import { useEditingProduct } from "../../refactoring/hooks/useEditingProduct";

const mockProducts: Product[] = [
  {
    id: "p1",
    name: "상품1",
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
  },
  {
    id: "p2",
    name: "상품2",
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: "p3",
    name: "상품3",
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
];

const mockCoupons: Coupon[] = [
  {
    name: "5000원 할인 쿠폰",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "10% 할인 쿠폰",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];

const TestAdminPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);

  const handleCouponAdd = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return (
    <ProductsProvider initialProducts={mockProducts}>
      <AdminPage coupons={coupons} onCouponAdd={handleCouponAdd} />
    </ProductsProvider>
  );
};

describe("advanced > ", () => {
  describe("시나리오 테스트 > ", () => {
    test("장바구니 페이지 테스트 > ", async () => {
      render(
        <ProductsProvider initialProducts={mockProducts}>
          <CartPage coupons={mockCoupons} />
        </ProductsProvider>
      );
      const product1 = screen.getByTestId("product-p1");
      const product2 = screen.getByTestId("product-p2");
      const product3 = screen.getByTestId("product-p3");
      const addToCartButtonsAtProduct1 =
        within(product1).getByText("장바구니에 추가");
      const addToCartButtonsAtProduct2 =
        within(product2).getByText("장바구니에 추가");
      const addToCartButtonsAtProduct3 =
        within(product3).getByText("장바구니에 추가");

      // 1. 상품 정보 표시
      expect(product1).toHaveTextContent("상품1");
      expect(product1).toHaveTextContent("10,000원");
      expect(product1).toHaveTextContent("재고: 20개");
      expect(product2).toHaveTextContent("상품2");
      expect(product2).toHaveTextContent("20,000원");
      expect(product2).toHaveTextContent("재고: 20개");
      expect(product3).toHaveTextContent("상품3");
      expect(product3).toHaveTextContent("30,000원");
      expect(product3).toHaveTextContent("재고: 20개");

      // 2. 할인 정보 표시
      expect(screen.getByText("10개 이상: 10% 할인")).toBeInTheDocument();

      // 3. 상품1 장바구니에 상품 추가
      fireEvent.click(addToCartButtonsAtProduct1); // 상품1 추가

      // 4. 할인율 계산
      expect(screen.getByText("상품 금액: 10,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 0원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 10,000원")).toBeInTheDocument();

      // 5. 상품 품절 상태로 만들기
      for (let i = 0; i < 19; i++) {
        fireEvent.click(addToCartButtonsAtProduct1);
      }

      // 6. 품절일 때 상품 추가 안 되는지 확인하기
      expect(product1).toHaveTextContent("재고: 0개");
      fireEvent.click(addToCartButtonsAtProduct1);
      expect(product1).toHaveTextContent("재고: 0개");

      // 7. 할인율 계산
      expect(screen.getByText("상품 금액: 200,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 20,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 180,000원")).toBeInTheDocument();

      // 8. 상품을 각각 10개씩 추가하기
      fireEvent.click(addToCartButtonsAtProduct2); // 상품2 추가
      fireEvent.click(addToCartButtonsAtProduct3); // 상품3 추가

      const increaseButtons = screen.getAllByText("+");
      for (let i = 0; i < 9; i++) {
        fireEvent.click(increaseButtons[1]); // 상품2
        fireEvent.click(increaseButtons[2]); // 상품3
      }

      // 9. 할인율 계산
      expect(screen.getByText("상품 금액: 700,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 110,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 590,000원")).toBeInTheDocument();

      // 10. 쿠폰 적용하기
      const couponSelect = screen.getByRole("combobox");
      fireEvent.change(couponSelect, { target: { value: "1" } }); // 10% 할인 쿠폰 선택

      // 11. 할인율 계산
      expect(screen.getByText("상품 금액: 700,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 169,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 531,000원")).toBeInTheDocument();

      // 12. 다른 할인 쿠폰 적용하기
      fireEvent.change(couponSelect, { target: { value: "0" } }); // 5000원 할인 쿠폰
      expect(screen.getByText("상품 금액: 700,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 115,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 585,000원")).toBeInTheDocument();
    });

    test("관리자 페이지 테스트 > ", async () => {
      render(<TestAdminPage />);

      const $product1 = screen.getByTestId("product-1");

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText("새 상품 추가"));

      fireEvent.change(screen.getByLabelText("상품명"), {
        target: { value: "상품4" },
      });
      fireEvent.change(screen.getByLabelText("가격"), {
        target: { value: "15000" },
      });
      fireEvent.change(screen.getByLabelText("재고"), {
        target: { value: "30" },
      });

      fireEvent.click(screen.getByText("추가"));

      const $product4 = screen.getByTestId("product-4");

      expect($product4).toHaveTextContent("상품4");
      expect($product4).toHaveTextContent("15000원");
      expect($product4).toHaveTextContent("재고: 30");

      // 2. 상품 선택 및 수정
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId("toggle-button"));
      fireEvent.click(within($product1).getByTestId("modify-button"));

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue("20"), {
          target: { value: "25" },
        });
        fireEvent.change(within($product1).getByDisplayValue("10000"), {
          target: { value: "12000" },
        });
        fireEvent.change(within($product1).getByDisplayValue("상품1"), {
          target: { value: "수정된 상품1" },
        });
      });

      fireEvent.click(within($product1).getByText("수정 완료"));

      expect($product1).toHaveTextContent("수정된 상품1");
      expect($product1).toHaveTextContent("12000원");
      expect($product1).toHaveTextContent("재고: 25");

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId("modify-button"));

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText("수량"), {
          target: { value: "5" },
        });
        fireEvent.change(screen.getByPlaceholderText("할인율 (%)"), {
          target: { value: "5" },
        });
      });
      fireEvent.click(screen.getByText("할인 추가"));

      expect(
        screen.queryByText("5개 이상 구매 시 5% 할인")
      ).toBeInTheDocument();

      // 할인 삭제
      fireEvent.click(screen.getAllByText("삭제")[0]);
      expect(
        screen.queryByText("10개 이상 구매 시 10% 할인")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("5개 이상 구매 시 5% 할인")
      ).toBeInTheDocument();

      fireEvent.click(screen.getAllByText("삭제")[0]);
      expect(
        screen.queryByText("10개 이상 구매 시 10% 할인")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("5개 이상 구매 시 5% 할인")
      ).not.toBeInTheDocument();

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText("쿠폰 이름"), {
        target: { value: "새 쿠폰" },
      });
      fireEvent.change(screen.getByPlaceholderText("쿠폰 코드"), {
        target: { value: "NEW10" },
      });
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "percentage" },
      });
      fireEvent.change(screen.getByPlaceholderText("할인 값"), {
        target: { value: "10" },
      });

      fireEvent.click(screen.getByText("쿠폰 추가"));

      const $newCoupon = screen.getByTestId("coupon-3");

      expect($newCoupon).toHaveTextContent("새 쿠폰 (NEW10):10% 할인");
    });
  });

  describe("유틸함수 테스트 >", () => {
    describe("toggleProductInSet", () => {
      it("productId가 Set에 없을 경우 추가한다.", () => {
        const prevProductIds = new Set<string>(["id1", "id2"]);
        const productId = "id3";

        const result = toggleProductInSet(prevProductIds, productId);

        expect(result.has(productId)).toBe(true);
        expect(result.size).toBe(3); // 'id1', 'id2', 'id3'
      });

      it("productId가 Set에 있을 경우 제거한다.", () => {
        const prevProductIds = new Set<string>(["id1", "id2"]);
        const productId = "id2";

        const result = toggleProductInSet(prevProductIds, productId);

        expect(result.has(productId)).toBe(false);
        expect(result.size).toBe(1); // 'id1'만 남음
      });

      it("원래 Set이 변경되지 않는다.", () => {
        const prevProductIds = new Set<string>(["id1", "id2"]);
        const productId = "id3";

        const result = toggleProductInSet(prevProductIds, productId);

        expect(prevProductIds.has(productId)).toBe(false);
        expect(prevProductIds.size).toBe(2); // 'id1', 'id2'
      });

      it("빈 Set에 대해 올바르게 동작한다.", () => {
        const prevProductIds = new Set<string>();
        const productId = "id1";

        const result = toggleProductInSet(prevProductIds, productId);

        expect(result.has(productId)).toBe(true);
        expect(result.size).toBe(1); // 'id1'만 추가됨
      });

      it("같은 productId를 여러 번 토글할 경우 올바르게 동작한다.", () => {
        const prevProductIds = new Set<string>(["id1"]);
        const productId = "id1";

        const firstToggle = toggleProductInSet(prevProductIds, productId);
        const secondToggle = toggleProductInSet(firstToggle, productId);

        expect(firstToggle.has(productId)).toBe(false); // 첫 번째 토글 후 제거됨
        expect(secondToggle.has(productId)).toBe(true); // 두 번째 토글 후 다시 추가됨
      });
    });

    describe("getMaxApplicableDiscount 함수", () => {
      it("상품1의 수량 조건(10개 이상)을 만족할 때 최대 할인율을 반환한다.", () => {
        const item: CartItem = {
          product: mockProducts[0],
          quantity: 10,
        };

        const result = getMaxApplicableDiscount(item);
        expect(result).toBe(0.1);
      });

      it("상품2의 수량 조건(10개 이상)을 만족할 때 최대 할인율을 반환한다.", () => {
        const item: CartItem = {
          product: mockProducts[1],
          quantity: 10,
        };

        const result = getMaxApplicableDiscount(item);
        expect(result).toBe(0.15);
      });

      it("상품3의 수량 조건(10개 이상)을 만족하지 못할 때 할인율은 0을 반환한다.", () => {
        const item: CartItem = {
          product: mockProducts[2],
          quantity: 5,
        };

        const result = getMaxApplicableDiscount(item);
        expect(result).toBe(0);
      });
    });

    describe("getMaxDiscount 함수", () => {
      it("상품1의 할인율 중 최대 값을 반환한다.", () => {
        const discounts = mockProducts[0].discounts;

        const result = getMaxDiscount(discounts);
        expect(result).toBe(0.1);
      });

      it("상품3의 할인율 중 최대 값을 반환한다.", () => {
        const discounts = mockProducts[2].discounts;

        const result = getMaxDiscount(discounts);
        expect(result).toBe(0.2);
      });
    });

    describe("calculateItemTotal 함수", () => {
      it("할인율이 적용된 상품1의 총 금액을 계산한다.", () => {
        const item: CartItem = {
          product: mockProducts[0],
          quantity: 10,
        };

        const result = calculateItemTotal(item);
        expect(result).toBe(10000 * 10 * (1 - 0.1));
      });

      it("할인 조건이 만족되지 않을 경우 상품3의 총 금액을 계산한다.", () => {
        const item: CartItem = {
          product: mockProducts[2],
          quantity: 5,
        };

        const result = calculateItemTotal(item);
        expect(result).toBe(30000 * 5);
      });
    });

    describe("calculateCartTotal 함수", () => {
      it("5000원 할인 쿠폰을 적용하여 장바구니 총 금액을 계산한다.", () => {
        const cart: CartItem[] = [
          {
            product: mockProducts[0],
            quantity: 10,
          },
          {
            product: mockProducts[1],
            quantity: 10,
          },
        ];

        const result = calculateCartTotal(cart, mockCoupons[0]);
        const totalBeforeDiscount = 10000 * 10 + 20000 * 10;
        const totalAfterDiscount = totalBeforeDiscount * (1 - 0.1) - 5000; // 할인율 10% + 5000원 쿠폰
        expect(result.totalBeforeDiscount).toBe(totalBeforeDiscount);
        expect(result.totalAfterDiscount).toBeGreaterThanOrEqual(0);
      });

      it("10% 할인 쿠폰을 적용하여 장바구니 총 금액을 계산한다.", () => {
        const cart: CartItem[] = [
          {
            product: mockProducts[0],
            quantity: 10,
          },
          {
            product: mockProducts[2],
            quantity: 10,
          },
        ];

        const result = calculateCartTotal(cart, mockCoupons[1]);
        const totalBeforeDiscount = 10000 * 10 + 30000 * 10; // 100000 + 300000 = 400000
        const totalAfterItemDiscount = 10000 * 10 * 0.9 + 30000 * 10 * 0.8; // 개별 할인율 적용
        const totalAfterCouponDiscount = totalAfterItemDiscount * 0.9; // 쿠폰 할인 적용

        expect(result.totalBeforeDiscount).toBe(totalBeforeDiscount);
        expect(result.totalAfterDiscount).toBeCloseTo(
          totalAfterCouponDiscount,
          3
        ); // 297000 예상
      });
    });

    describe("updateCartItemQuantity 함수", () => {
      it("장바구니 아이템 수량을 업데이트 한다.", () => {
        const prevCart: CartItem[] = [
          {
            product: mockProducts[0], // 상품1: 10000원, 20개 재고, 10개 장바구니
            quantity: 10,
          },
          {
            product: mockProducts[1], // 상품2: 20000원, 20개 재고, 5개 장바구니
            quantity: 5,
          },
        ];

        // 상품1의 수량을 15로 변경
        const updatedCart = updateCartItemQuantity(prevCart, "p1", 15);

        // 예상되는 장바구니
        const expectedCart = [
          {
            product: mockProducts[0], // 상품1: 수량 15로 변경됨
            quantity: 15,
          },
          {
            product: mockProducts[1], // 상품2: 수량은 변경되지 않음
            quantity: 5,
          },
        ];

        expect(updatedCart).toEqual(expectedCart);
      });

      it("수량을 0으로 변경하면 해당 상품은 장바구니에서 제외된다.", () => {
        const prevCart: CartItem[] = [
          {
            product: mockProducts[0], // 상품1: 10000원, 20개 재고, 10개 장바구니
            quantity: 10,
          },
          {
            product: mockProducts[1], // 상품2: 20000원, 20개 재고, 5개 장바구니
            quantity: 5,
          },
        ];

        // 상품1의 수량을 0으로 변경
        const updatedCart = updateCartItemQuantity(prevCart, "p1", 0);

        // 예상되는 장바구니 (상품1 제외)
        const expectedCart = [
          {
            product: mockProducts[1], // 상품2: 수량은 변경되지 않음
            quantity: 5,
          },
        ];

        expect(updatedCart).toEqual(expectedCart);
      });

      it("수량을 재고보다 많으면 재고 한도 내에서 수량을 변경한다.", () => {
        const prevCart: CartItem[] = [
          {
            product: mockProducts[0], // 상품1: 10000원, 20개 재고, 10개 장바구니
            quantity: 10,
          },
        ];

        // 상품1의 수량을 30으로 변경 (재고는 20개이므로 20개로 변경됨)
        const updatedCart = updateCartItemQuantity(prevCart, "p1", 30);

        // 예상되는 장바구니 (상품1: 수량 20으로 변경)
        const expectedCart = [
          {
            product: mockProducts[0], // 상품1: 수량 20으로 변경됨
            quantity: 20,
          },
        ];

        expect(updatedCart).toEqual(expectedCart);
      });
    });

    describe("getRemainingStock 함수", () => {
      it("남은 재고 수를 계산한다.", () => {
        const cart: CartItem[] = [
          {
            product: mockProducts[0], // 상품1: 10000원, 20개 재고, 10개 장바구니
            quantity: 10,
          },
          {
            product: mockProducts[1], // 상품2: 20000원, 20개 재고, 5개 장바구니
            quantity: 5,
          },
        ];

        // 상품1의 남은 재고는 20 - 10 = 10
        const remainingStockForProduct1 = getRemainingStock(
          mockProducts[0],
          cart
        );
        expect(remainingStockForProduct1).toBe(10);

        // 상품2의 남은 재고는 20 - 5 = 15
        const remainingStockForProduct2 = getRemainingStock(
          mockProducts[1],
          cart
        );
        expect(remainingStockForProduct2).toBe(15);

        // 상품3는 장바구니에 없으므로 재고 그대로 20
        const remainingStockForProduct3 = getRemainingStock(
          mockProducts[2],
          cart
        );
        expect(remainingStockForProduct3).toBe(20);
      });
    });

    describe("getAppliedDiscount 함수", () => {
      it("상품에 적용 가능한 할인율을 반환한다.", () => {
        const cart: CartItem[] = [
          {
            product: mockProducts[0], // 상품1: 10000원, 10개 이상 구매 시 10% 할인
            quantity: 10,
          },
          {
            product: mockProducts[1], // 상품2: 20000원, 10개 이상 구매 시 15% 할인
            quantity: 5,
          },
        ];

        // 상품1은 10개 이상 구매하므로 10% 할인 적용
        const appliedDiscountForProduct1 = getAppliedDiscount(cart[0]);
        expect(appliedDiscountForProduct1).toBe(0.1);

        // 상품2는 10개 이상 구매하지 않으므로 할인 적용 안됨
        const appliedDiscountForProduct2 = getAppliedDiscount(cart[1]);
        expect(appliedDiscountForProduct2).toBe(0);
      });
    });
  });

  describe("hook 함수 테스트 >", () => {
    describe("useOpenProductIds", () => {
      it("productId를 토글하면 Set에 추가된다", () => {
        const { result } = renderHook(() => useOpenProductIds());

        // Act: productId를 토글
        act(() => {
          result.current.toggleProductAccordion("product-1"); // ! toggleProductInSet 과 같이 내부에서 동작하는 유틸함수를 주입할수 있도록 할 필요가 있나?
        });

        // Assert: productId가 Set에 추가되었는지 확인
        expect(result.current.openProductIds.has("product-1")).toBe(true);
      });

      it("productId를 다시 토글하면 Set에서 제거된다", () => {
        const { result } = renderHook(() => useOpenProductIds());

        // 먼저 productId를 추가
        act(() => {
          result.current.toggleProductAccordion("product-1");
        });

        // Act: 같은 productId를 다시 토글하여 제거
        act(() => {
          result.current.toggleProductAccordion("product-1");
        });

        // Assert: productId가 Set에서 제거되었는지 확인
        expect(result.current.openProductIds.has("product-1")).toBe(false);
      });
    });

    describe("useNewCoupon", () => {
      it("초기값이 기본 값으로 설정된다", () => {
        const { result } = renderHook(() => useNewCoupon());

        // Assert: 기본 값이 올바르게 설정되었는지 확인
        expect(result.current.newCoupon).toEqual({
          name: "",
          code: "",
          discountType: "percentage",
          discountValue: 0,
        });
      });

      it("setNewCouponName이 name을 올바르게 설정한다", () => {
        const { result } = renderHook(() => useNewCoupon());

        // Act: setNewCouponName 호출
        act(() => {
          result.current.setNewCouponName("New Year Sale");
        });

        // Assert: name이 업데이트되었는지 확인
        expect(result.current.newCoupon.name).toBe("New Year Sale");
      });

      it("setNewCouponCode가 code를 올바르게 설정한다", () => {
        const { result } = renderHook(() => useNewCoupon());

        // Act: setNewCouponCode 호출
        act(() => {
          result.current.setNewCouponCode("NY2025");
        });

        // Assert: code가 업데이트되었는지 확인
        expect(result.current.newCoupon.code).toBe("NY2025");
      });

      it("setNewCouponDiscountType이 discountType을 올바르게 설정한다", () => {
        const { result } = renderHook(() => useNewCoupon());

        // Act: setNewCouponDiscountType 호출
        act(() => {
          result.current.setNewCouponDiscountType("amount");
        });

        // Assert: discountType이 업데이트되었는지 확인
        expect(result.current.newCoupon.discountType).toBe("amount");
      });

      it("setNewCouponDiscountValue가 discountValue를 올바르게 설정한다", () => {
        const { result } = renderHook(() => useNewCoupon());

        // Act: setNewCouponDiscountValue 호출
        act(() => {
          result.current.setNewCouponDiscountValue(20);
        });

        // Assert: discountValue가 업데이트되었는지 확인
        expect(result.current.newCoupon.discountValue).toBe(20);
      });

      it("resetNewCoupon이 값을 기본 값으로 리셋한다", () => {
        const { result } = renderHook(() => useNewCoupon());

        // Act: 새로운 값을 설정한 후 resetNewCoupon 호출
        act(() => {
          result.current.setNewCouponName("Black Friday Sale");
          result.current.setNewCouponCode("BF2025");
          result.current.setNewCouponDiscountType("percentage");
          result.current.setNewCouponDiscountValue(50);
          result.current.resetNewCoupon();
        });

        // Assert: 값들이 기본값으로 리셋되었는지 확인
        expect(result.current.newCoupon).toEqual({
          name: "",
          code: "",
          discountType: "percentage",
          discountValue: 0,
        });
      });
    });

    describe("useEditingProduct", () => {
      it("초기 값은 editingProduct가 null로 설정된다", () => {
        const { result } = renderHook(() => useEditingProduct());

        // Assert: 초기값이 null인지 확인
        expect(result.current.editingProduct).toBeNull();
      });

      it("setEditingProduct로 editingProduct를 설정할 수 있다", () => {
        const { result } = renderHook(() => useEditingProduct());

        const product: Product = {
          id: "1",
          name: "Product 1",
          price: 100,
          stock: 50,
          discounts: [],
        };

        // Act: setEditingProduct 호출
        act(() => {
          result.current.setEditingProduct(product);
        });

        // Assert: editingProduct가 설정되었는지 확인
        expect(result.current.editingProduct).toEqual(product);
      });

      it("updateProductName이 product의 name을 업데이트한다", () => {
        const { result } = renderHook(() => useEditingProduct());

        const product: Product = {
          id: "1",
          name: "Product 1",
          price: 100,
          stock: 50,
          discounts: [],
        };
        act(() => {
          result.current.setEditingProduct(product);
        });

        // Act: updateProductName 호출
        act(() => {
          result.current.updateProductName("1", "Updated Product");
        });

        // Assert: name이 업데이트되었는지 확인
        expect(result.current.editingProduct?.name).toBe("Updated Product");
      });

      it("updateProductPrice가 product의 price를 업데이트한다", () => {
        const { result } = renderHook(() => useEditingProduct());

        const product: Product = {
          id: "1",
          name: "Product 1",
          price: 100,
          stock: 50,
          discounts: [],
        };
        act(() => {
          result.current.setEditingProduct(product);
        });

        // Act: updateProductPrice 호출
        act(() => {
          result.current.updateProductPrice("1", 150);
        });

        // Assert: price가 업데이트되었는지 확인
        expect(result.current.editingProduct?.price).toBe(150);
      });

      it("updateProductName은 productId가 일치할 때만 name을 업데이트한다", () => {
        const { result } = renderHook(() => useEditingProduct());

        const product: Product = {
          id: "1",
          name: "Product 1",
          price: 100,
          stock: 50,
          discounts: [],
        };
        act(() => {
          result.current.setEditingProduct(product);
        });

        // Act: 다른 productId로 updateProductName 호출
        act(() => {
          result.current.updateProductName("2", "Updated Product");
        });

        // Assert: name이 업데이트되지 않았는지 확인
        expect(result.current.editingProduct?.name).toBe("Product 1");
      });

      it("completeProductEdit이 editingProduct를 null로 리셋한다", () => {
        const { result } = renderHook(() => useEditingProduct());

        const product: Product = {
          id: "1",
          name: "Product 1",
          price: 100,
          stock: 50,
          discounts: [],
        };
        act(() => {
          result.current.setEditingProduct(product);
        });

        // Act: completeProductEdit 호출
        act(() => {
          result.current.completeProductEdit();
        });

        // Assert: editingProduct가 null로 리셋되었는지 확인
        expect(result.current.editingProduct).toBeNull();
      });
    });
  });
});
