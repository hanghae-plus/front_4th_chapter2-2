import { useState } from "react";
import { describe, expect, test } from "vitest";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  within,
} from "@testing-library/react";
import { CartPage } from "../../refactoring/pages/CartPage.tsx";
import { AdminPage } from "../../refactoring/pages/AdminPage.tsx";
import { Coupon, Product } from "../../types";
import { formatDiscount } from "../../refactoring/utils/formatDicount.ts";
import { getMaxDiscount } from "../../refactoring/utils/getMaxDiscount.ts";
import { calculateTotalAfterDiscount } from "../../refactoring/utils/cartUtils.ts";
import { CartItem } from "../../types";
import { useProducts } from "../../refactoring/hooks/useProduct.ts";
import { useCoupons } from "../../refactoring/hooks/useCoupon.ts";
import { useCart } from "../../refactoring/hooks/useCart.ts";
import { initialProducts } from "../../store/globalStore.ts";

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
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
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
      onProductUpdate={handleProductUpdate}
      onProductAdd={handleProductAdd}
      coupons={coupons}
      onCouponAdd={handleCouponAdd}
    />
  );
};

describe("advanced > ", () => {
  describe("시나리오 테스트 > ", () => {
    test("장바구니 페이지 테스트 > ", async () => {
      render(<CartPage products={mockProducts} coupons={mockCoupons} />);
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

  describe("자유롭게 작성해보세요.", () => {
    // 새로운 유틸 함수 테스트
    test("formatDiscount 함수가 올바르게 동작해야 한다", () => {
      const couponAmount: Coupon = {
        name: "Test Amount",
        code: "TEST1",
        discountType: "amount",
        discountValue: 5000,
      };
      const couponPercentage: Coupon = {
        name: "Test Percentage",
        code: "TEST2",
        discountType: "percentage",
        discountValue: 15,
      };

      // 할인 타입이 'amount'일 때
      expect(formatDiscount(couponAmount)).toBe("5000원");

      // 할인 타입이 'percentage'일 때
      expect(formatDiscount(couponPercentage)).toBe("15%");
    });

    // // 에지 케이스 처리
    test("formatDiscount 함수가 edge case를 올바르게 처리해야 한다", () => {
      const couponZero: Coupon = {
        name: "Zero Discount",
        code: "ZERO",
        discountType: "amount",
        discountValue: 0,
      };
      const couponNegative: Coupon = {
        name: "Negative Discount",
        code: "NEG",
        discountType: "percentage",
        discountValue: -10,
      };

      // 할인 값이 0일 때
      expect(formatDiscount(couponZero)).toBe("0원");

      // 할인 값이 음수일 때
      expect(formatDiscount(couponNegative)).toBe("-10%");
    });

    test("getMaxDiscount 함수가 최대 할인율을 올바르게 반환해야 한다", () => {
      const discounts = [
        { quantity: 2, rate: 10 },
        { quantity: 3, rate: 20 },
        { quantity: 3, rate: 30 },
      ];
      expect(getMaxDiscount(discounts)).toBe(30);
    });

    test("getMaxDiscount 함수가 빈 할인 배열에서 0을 반환해야 한다", () => {
      expect(getMaxDiscount([])).toBe(0);
    });

    test("getMaxDiscount 함수가 음수 할인 값을 무시하고 최대값을 반환해야 한다", () => {
      const discounts = [
        { quantity: 2, rate: -5 },
        { quantity: 3, rate: 10 },
        { quantity: 3, rate: 15 },
      ];
      expect(getMaxDiscount(discounts)).toBe(15);
    });

    const mockCart: CartItem[] = [
      {
        product: {
          id: "p1",
          name: "상품1",
          price: 10000,
          stock: 10,
          discounts: [{ quantity: 2, rate: 0.1 }],
        },
        quantity: 1,
      },
      {
        product: {
          id: "p2",
          name: "상품2",
          price: 20000,
          stock: 20,
          discounts: [{ quantity: 3, rate: 0.2 }],
        },
        quantity: 3,
      },
      {
        product: {
          id: "p3",
          name: "상품3",
          price: 5000,
          stock: 15,
          discounts: [{ quantity: 5, rate: 0.3 }],
        },
        quantity: 5,
      },
    ];

    test("할인이 적용되지 않은 경우 총 가격이 원래 가격과 동일해야 한다", () => {
      const cartWithoutDiscounts: CartItem[] = mockCart.map((item) => ({
        ...item,
        product: { ...item.product, discounts: [] }, // 할인 없는 상태로 변경
      }));
      expect(calculateTotalAfterDiscount(cartWithoutDiscounts)).toBe(95000);
    });

    test("할인 조건을 충족하는 경우 할인율이 적용된 총 가격을 반환해야 한다", () => {
      expect(calculateTotalAfterDiscount(mockCart)).toBe(
        10000 * 1 + 20000 * 3 * (1 - 0.2) + 5000 * 5 * (1 - 0.3)
      );
    });

    test("장바구니가 비어 있으면 총 가격은 0이어야 한다", () => {
      expect(calculateTotalAfterDiscount([])).toBe(0);
    });

    test("상품 수량이 할인 조건보다 적으면 할인이 적용되지 않아야 한다", () => {
      const cartWithLowQuantity: CartItem[] = [
        {
          product: {
            id: "p1",
            name: "상품1",
            price: 10000,
            stock: 5,
            discounts: [{ quantity: 5, rate: 0.1 }],
          },
          quantity: 2,
        },
      ];
      expect(calculateTotalAfterDiscount(cartWithLowQuantity)).toBe(20000);
    });

    test("여러 개의 할인율이 있는 경우 가장 높은 할인율이 적용되어야 한다", () => {
      const cartWithMultipleDiscounts: CartItem[] = [
        {
          product: {
            id: "p1",
            name: "상품1",
            price: 10000,
            stock: 10,
            discounts: [
              { quantity: 2, rate: 0.1 },
              { quantity: 5, rate: 0.2 },
            ],
          },
          quantity: 5,
        },
      ];
      expect(calculateTotalAfterDiscount(cartWithMultipleDiscounts)).toBe(
        10000 * 5 * (1 - 0.2)
      );
    });
  });
});
