import { FC, useState } from "react";
import { beforeEach, describe, expect, test, vitest } from "vitest";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  within,
} from "@testing-library/react";

import { CartItem, Coupon, Product } from "../../types";
import { AdminPage } from "../../refactoring/pages/AdminPage";
import { CartPage } from "../../refactoring/pages/CartPage";
import {
  createValidators,
  validateField,
} from "../../refactoring/utils/validatorUtils";
import { useForm, useProductSearch } from "../../refactoring/hooks";
import { useCartStorage } from "../../refactoring/hooks/useCartStorage";
import {
  applyCouponDiscount,
  calculateItemDiscount,
  calculateTotal,
} from "../../refactoring/utils/cartDiscountUtils";

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

const mockCart: Array<CartItem> = [
  {
    product: {
      price: 10000,
      discounts: [{ quantity: 2, rate: 0.1 }],
      id: "test1",
      name: "상품1",
      stock: 20,
    },
    quantity: 2,
  },
  {
    product: {
      price: 5000,
      discounts: [{ quantity: 3, rate: 0.2 }],
      id: "test2",
      name: "상품2",
      stock: 10,
    },
    quantity: 3,
  },
  {
    product: {
      price: 10000,
      discounts: [],
      id: "test3",
      name: "상품3",
      stock: 10,
    },
    quantity: 2,
  },
];

const TestAdminPage = () => {
  const [products, setProducts] = useState<Array<Product>>(mockProducts);
  const [coupons, setCoupons] = useState<Array<Coupon>>(mockCoupons);

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
      coupons={coupons}
      onProductUpdate={handleProductUpdate}
      onProductAdd={handleProductAdd}
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
    describe("[utils - validateField] 주어진 값에 대해 올바른 검증 결과를 반환하는지 확인 합니다", () => {
      const validators = createValidators<string>();

      test("빈 값 검증", () => {
        const validatorList = [validators.required()];

        expect(validateField("", validatorList)).toBe("필수 입력값입니다");
        expect(validateField("  ", validatorList)).toBe("필수 입력값입니다");
        expect(validateField("hello", validatorList)).toBeUndefined();
      });

      test("최소 길이 검증", () => {
        const validatorList = [validators.min(3)];

        expect(validateField("a", validatorList)).toBe("3자 이상 입력하세요");
        expect(validateField("ab", validatorList)).toBe("3자 이상 입력하세요");
        expect(validateField("abc", validatorList)).toBeUndefined();
        expect(validateField("abcd", validatorList)).toBeUndefined();
      });

      test("최대 길이 검증", () => {
        const validatorList = [validators.max(3)];

        expect(validateField("a", validatorList)).toBeUndefined();
        expect(validateField("abc", validatorList)).toBeUndefined();
        expect(validateField("abcd", validatorList)).toBe(
          "3자 이하로 입력하세요"
        );
      });

      test("커스텀 검증", () => {
        const validateOnlyNumbers = validators.custom(
          (value) => /^\d+$/.test(value),
          "숫자만 입력 가능합니다"
        );
        const validatorList = [validateOnlyNumbers];

        expect(validateField("123", validatorList)).toBeUndefined();
        expect(validateField("abc", validatorList)).toBe(
          "숫자만 입력 가능합니다"
        );
        expect(validateField("12a", validatorList)).toBe(
          "숫자만 입력 가능합니다"
        );
      });

      test("복합 적인 검증 규칙 적용", () => {
        const validatorList = [
          validators.required(),
          validators.min(3),
          validators.max(5),
        ];

        expect(validateField("", validatorList)).toBe("필수 입력값입니다");
        expect(validateField("ab", validatorList)).toBe("3자 이상 입력하세요");
        expect(validateField("abcdef", validatorList)).toBe(
          "5자 이하로 입력하세요"
        );
        expect(validateField("abcd", validatorList)).toBeUndefined();
      });
    });

    describe("[utils - calculateItemDiscount] 상품 단일 할인 계산 함수", () => {
      test("기본 가격과 수량에 따른 할인 계산", () => {
        const result = calculateItemDiscount(mockCart[0]);

        expect(result.beforeDiscount).toBe(20000);
        expect(result.afterDiscount).toBe(18000);
      });

      test("할인 적용되지 않는 경우", () => {
        const result = calculateItemDiscount(mockCart[2]);

        expect(result.beforeDiscount).toBe(20000);
        expect(result.afterDiscount).toBe(20000);
      });
    });

    describe("[utils - applyCouponDiscount] 쿠폰 할인 계산 함수", () => {
      test("금액 할인 쿠폰 적용", () => {
        const result = applyCouponDiscount(30000, 24000, mockCoupons[0]);

        expect(result.finalAfterDiscount).toBe(19000);
        expect(result.totalDiscount).toBe(11000);
      });

      test("퍼센트 할인 쿠폰 적용", () => {
        const result = applyCouponDiscount(30000, 24000, mockCoupons[0]);

        expect(result.finalAfterDiscount).toBe(19000);
        expect(result.totalDiscount).toBe(11000);
      });

      test("쿠폰이 없는 경우", () => {
        const result = applyCouponDiscount(30000, 24000, null);

        expect(result.finalAfterDiscount).toBe(24000);
        expect(result.totalDiscount).toBe(6000);
      });
    });

    describe("[utils - calculateTotal] 장바구니 총계 계산 함수", () => {
      test("전체 장바구니 계산 (쿠폰 포함)", () => {
        const result = calculateTotal(mockCart, mockCoupons[0]);

        expect(result.totalBeforeDiscount).toBe(55000);
        expect(result.totalAfterDiscount).toBe(45000);
        expect(result.totalDiscount).toBe(10000);
      });

      test("전체 장바구니 계산 (쿠폰 미포함)", () => {
        const result = calculateTotal(mockCart, null);

        expect(result.totalBeforeDiscount).toBe(55000);
        expect(result.totalAfterDiscount).toBe(50000);
        expect(result.totalDiscount).toBe(5000);
      });
    });

    const mockLocalStorage = {
      getItem: vitest.fn(),
      setItem: vitest.fn(),
      removeItem: vitest.fn(),
    };

    beforeEach(() => {
      vitest.stubGlobal("localStorage", mockLocalStorage);
      vitest.clearAllMocks();
    });

    describe("[hook - useForm] 훅이 폼 상태 관리와 입력 값 업데이트가 올바르게 작동하는지 확인 합니다", () => {
      interface TestFieldValues {
        username: string;
        email: string;
      }

      const TestForm: FC<{ onSubmit: (values: unknown) => void }> = ({
        onSubmit,
      }) => {
        const { register, handleSubmit } = useForm<TestFieldValues>();

        return (
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("username")} data-testid="username-input" />
            <input {...register("email")} data-testid="email-input" />
            <button type="submit" data-testid="submit-button">
              Submit
            </button>
          </form>
        );
      };

      test("기본 폼 입력 및 제출이 정상적으로 동작해야 합니다", async () => {
        const handleSubmit = vitest.fn();
        render(<TestForm onSubmit={handleSubmit} />);

        const usernameInput = screen.getByTestId("username-input");
        const emailInput = screen.getByTestId("email-input");

        await act(async () => {
          fireEvent.change(usernameInput, { target: { value: "testuser" } });
          fireEvent.change(emailInput, {
            target: { value: "test@example.com" },
          });
        });

        await act(async () => {
          fireEvent.click(screen.getByTestId("submit-button"));
        });

        expect(handleSubmit).toHaveBeenCalledWith({
          username: "testuser",
          email: "test@example.com",
        });
      });

      test("defaultValues가 정상적으로 설정되어야 합니다", () => {
        const TestFormWithDefaults: FC = () => {
          const { register } = useForm<TestFieldValues>({
            defaultValues: {
              username: "defaultUser",
              email: "default@example.com",
            },
          });

          return (
            <form>
              <input {...register("username")} data-testid="username-input" />
              <input {...register("email")} data-testid="email-input" />
            </form>
          );
        };

        render(<TestFormWithDefaults />);
        expect(screen.getByTestId("username-input")).toHaveValue("defaultUser");
        expect(screen.getByTestId("email-input")).toHaveValue(
          "default@example.com"
        );
      });

      test("setValue 함수가 정상적으로 동작해야 합니다", () => {
        const TestFormWithSetValue: FC = () => {
          const { register, setValue } =
            useForm<Pick<TestFieldValues, "username">>();

          return (
            <div>
              <input {...register("username")} data-testid="username-input" />
              <button
                onClick={() => setValue("username", "newValue")}
                data-testid="set-value-button"
              >
                Set Value
              </button>
            </div>
          );
        };

        render(<TestFormWithSetValue />);

        act(() => {
          fireEvent.click(screen.getByTestId("set-value-button"));
        });

        expect(screen.getByTestId("username-input")).toHaveValue("newValue");
      });

      test("getValue 함수가 정상적으로 동작해야 합니다", () => {
        const TestFormWithGetValue: FC = () => {
          const { register, getValue } = useForm<
            Pick<TestFieldValues, "username">
          >({
            defaultValues: {
              username: "initialValue",
            },
          });

          return (
            <div>
              <input {...register("username")} data-testid="username-input" />
              <div data-testid="value-display">{getValue("username")}</div>
            </div>
          );
        };

        render(<TestFormWithGetValue />);
        expect(screen.getByTestId("value-display")).toHaveTextContent(
          "initialValue"
        );
      });

      test("getValue 함수가 정상적으로 동작해야 합니다", () => {
        const TestFormWithGetValue: FC = () => {
          const { register, getValue } = useForm<
            Pick<TestFieldValues, "username">
          >({
            defaultValues: {
              username: "initialValue",
            },
          });

          return (
            <div>
              <input {...register("username")} data-testid="username-input" />
              <div data-testid="value-display">{getValue("username")}</div>
            </div>
          );
        };

        render(<TestFormWithGetValue />);

        expect(screen.getByTestId("value-display")).toHaveTextContent(
          "initialValue"
        );
      });
    });

    vitest.mock("../utils/storage-utils", () => ({
      getLocalStorageItem: vitest.fn(() => []),
      setLocalStorageItem: vitest.fn(),
    }));

    describe("[hook - useCartStorage] 훅이 카트 상태 관리 및 쿠폰 적용이 올바르게 작동하는지 확인 합니다", () => {
      test("장바구니 기본 기능이 정상 동작해야 합니다", () => {
        const { result } = renderHook(() => useCartStorage());

        expect(result.current.cart).toEqual([]);
        expect(result.current.selectedCoupon).toBeNull();

        act(() => {
          result.current.addToCart(mockProducts[0]);
        });
        expect(result.current.cart).toHaveLength(1);
        expect(result.current.cart[0].quantity).toBe(1);

        act(() => {
          result.current.updateQuantity(mockProducts[0].id, 3);
        });
        expect(result.current.cart[0].quantity).toBe(3);

        act(() => {
          result.current.removeFromCart(mockProducts[0].id);
        });
        expect(result.current.cart).toHaveLength(0);
      });

      test("쿠폰 적용과 총액 계산이 정상 동작해야 합니다", () => {
        const { result } = renderHook(() => useCartStorage());

        act(() => {
          result.current.addToCart(mockProducts[0]);
          result.current.applyCoupon(mockCoupons[0]);
        });

        expect(result.current.selectedCoupon).toEqual(mockCoupons[0]);

        const total = result.current.calculateTotal();
        expect(total).toEqual({
          totalBeforeDiscount: 10000,
          totalAfterDiscount: 5000,
          totalDiscount: 5000,
        });
      });
    });

    describe("[hook - useProductSearch] 훅이 제품 검색 및 검색 초기화가 올바르게 작동하는지 확인 합니다", () => {
      test("기본 검색 기능이 정상 동작해야 합니다", () => {
        const { result } = renderHook(() => useProductSearch(mockProducts));

        expect(result.current.searchResults).toEqual(mockProducts);
        expect(result.current.searchQuery).toBe("");

        act(() => {
          result.current.setSearchQuery("1");
          result.current.handleSearch();
        });

        expect(result.current.searchResults).toHaveLength(1);
        expect(result.current.searchResults.map((p) => p.name)).toEqual([
          "상품1",
        ]);
      });

      test("검색어 리셋이 정상 동작해야 합니다", () => {
        const { result } = renderHook(() => useProductSearch(mockProducts));

        act(() => {
          result.current.setSearchQuery("상품2");
          result.current.handleSearch();
        });

        expect(result.current.searchResults).toHaveLength(1);

        act(() => {
          result.current.resetSearch();
        });

        expect(result.current.searchQuery).toBe("");
        expect(result.current.searchResults).toEqual(mockProducts);
      });
    });
  });
});
