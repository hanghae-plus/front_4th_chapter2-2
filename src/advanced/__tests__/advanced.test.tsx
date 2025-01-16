import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  within,
} from "@testing-library/react";
import { useState } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { useGrades } from "../../refactoring/hooks/useGrade";
import { useLocalStorage } from "../../refactoring/hooks/useLocalStorage";
import { useProductSearch } from "../../refactoring/hooks/useProductSearch";
import validateCoupon from "../../refactoring/lib/validateCoupon";
import validateProduct from "../../refactoring/lib/validateProduct";
import {
  applyCouponDiscount,
  applyGradeDiscount,
  calculateBulkDiscount,
  calculateItemSubtotal,
} from "../../refactoring/models/cart";
import { AdminPage } from "../../refactoring/pages/AdminPage";
import { CartPage } from "../../refactoring/pages/CartPage";
import { CartItem, Coupon, Grade, Product } from "../../types";

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

const mockGrades: Grade[] = [
  {
    name: "VIP",
    rate: 10,
  },
];

const TestAdminPage = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [grades, setGrades] = useState<Grade[]>(mockGrades);
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

  const handleGradeAdd = (newGrade: Grade) => {
    setGrades((prevGrades) => [...prevGrades, newGrade]);
  };

  return (
    <AdminPage
      products={products}
      coupons={coupons}
      grades={grades}
      onProductUpdate={handleProductUpdate}
      onProductAdd={handleProductAdd}
      onCouponAdd={handleCouponAdd}
      onGradeAdd={handleGradeAdd}
    />
  );
};

describe("advanced > ", () => {
  describe("시나리오 테스트 > ", () => {
    test("장바구니 페이지 테스트 > ", async () => {
      render(
        <CartPage
          products={mockProducts}
          coupons={mockCoupons}
          grades={mockGrades}
        />
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
      const [couponSelect] = screen.getAllByRole("combobox");
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

  describe("validateCoupon 테스트 >", () => {
    test("유효한 쿠폰 데이터는 빈 오류 객체를 반환한다", () => {
      const validCoupon = {
        name: "테스트 쿠폰",
        code: "TEST10",
        discountType: "percentage",
        discountValue: 10,
      };

      const errors = validateCoupon(validCoupon as Coupon);
      expect(errors).toEqual({});
    });

    test("쿠폰명 유효성 검사", () => {
      const emptyNameCoupon = {
        name: "",
        code: "TEST10",
        discountType: "percentage",
        discountValue: 10,
      };

      const longNameCoupon = {
        name: "a".repeat(51),
        code: "TEST10",
        discountType: "percentage",
        discountValue: 10,
      };

      const emptyNameErrors = validateCoupon(emptyNameCoupon as Coupon);
      expect(emptyNameErrors.name).toBe("쿠폰 이름을 입력해주세요");

      const longNameErrors = validateCoupon(longNameCoupon as Coupon);
      expect(longNameErrors.name).toBe("쿠폰 이름은 50자 이내로 입력해주세요");
    });

    test("쿠폰 코드 유효성 검사", () => {
      const emptyCodeCoupon = {
        name: "테스트 쿠폰",
        code: "",
        discountType: "percentage",
        discountValue: 10,
      };

      const longCodeCoupon = {
        name: "테스트 쿠폰",
        code: "a".repeat(11),
        discountType: "percentage",
        discountValue: 10,
      };

      const emptyCodeErrors = validateCoupon(emptyCodeCoupon as Coupon);
      expect(emptyCodeErrors.code).toBe("쿠폰 코드를 입력해주세요");

      const longCodeErrors = validateCoupon(longCodeCoupon as Coupon);
      expect(longCodeErrors.code).toBe("쿠폰 코드는 10자 이내로 입력해주세요");
    });

    test("할인 유형 및 값 유효성 검사", () => {
      const emptyTypeCoupon = {
        name: "테스트 쿠폰",
        code: "TEST10",
        discountType: "",
        discountValue: 10,
      };

      const invalidPercentageCoupon = {
        name: "테스트 쿠폰",
        code: "TEST10",
        discountType: "percentage",
        discountValue: 101,
      };

      const negativePercentageCoupon = {
        name: "테스트 쿠폰",
        code: "TEST10",
        discountType: "percentage",
        discountValue: -1,
      };

      const emptyValueCoupon = {
        name: "테스트 쿠폰",
        code: "TEST10",
        discountType: "percentage",
        discountValue: 0,
      };

      const emptyTypeErrors = validateCoupon(emptyTypeCoupon as Coupon);
      expect(emptyTypeErrors.discountType).toBe("할인 유형을 선택해주세요");

      const invalidPercentageErrors = validateCoupon(
        invalidPercentageCoupon as Coupon
      );
      expect(invalidPercentageErrors.discountValue).toBe(
        "할인율은 0% 이상 100% 이하로 입력해주세요"
      );

      const negativePercentageErrors = validateCoupon(
        negativePercentageCoupon as Coupon
      );
      expect(negativePercentageErrors.discountValue).toBe(
        "할인율은 0% 이상 100% 이하로 입력해주세요"
      );

      const emptyValueErrors = validateCoupon(emptyValueCoupon as Coupon);
      expect(emptyValueErrors.discountValue).toBe("할인 값을 입력해주세요");
    });

    test("복합 유효성 검사", () => {
      const invalidCoupon = {
        name: "",
        code: "a".repeat(11),
        discountType: "",
        discountValue: 101,
      };

      const errors = validateCoupon(invalidCoupon as Coupon);
      expect(errors).toEqual({
        name: "쿠폰 이름을 입력해주세요",
        code: "쿠폰 코드는 10자 이내로 입력해주세요",
        discountType: "할인 유형을 선택해주세요",
      });
    });
  });

  describe("validateProduct 테스트 >", () => {
    test("유효한 상품 데이터는 빈 오류 객체를 반환한다", () => {
      const validProduct = {
        name: "테스트 상품",
        price: 10000,
        stock: 10,
        discounts: [],
      };

      const errors = validateProduct(validProduct);
      expect(errors).toEqual({});
    });

    test("상품명 유효성 검사", () => {
      const emptyNameProduct = {
        name: "",
        price: 10000,
        stock: 10,
        discounts: [],
      };

      const longNameProduct = {
        name: "a".repeat(51),
        price: 10000,
        stock: 10,
        discounts: [],
      };

      const emptyNameErrors = validateProduct(emptyNameProduct);
      expect(emptyNameErrors.name).toBe("상품명을 입력해주세요");

      const longNameErrors = validateProduct(longNameProduct);
      expect(longNameErrors.name).toBe("상품명은 50자 이내로 입력해주세요");
    });

    test("가격 유효성 검사", () => {
      const zeroPriceProduct = {
        name: "테스트 상품",
        price: 0,
        stock: 10,
        discounts: [],
      };

      const negativePriceProduct = {
        name: "테스트 상품",
        price: -1000,
        stock: 10,
        discounts: [],
      };

      const zeroPriceErrors = validateProduct(zeroPriceProduct);
      expect(zeroPriceErrors.price).toBe("가격을 입력해주세요");

      const negativePriceErrors = validateProduct(negativePriceProduct);
      expect(negativePriceErrors.price).toBe("가격은 0원 이상이어야 합니다");
    });

    test("재고 유효성 검사", () => {
      const zeroStockProduct = {
        name: "테스트 상품",
        price: 10000,
        stock: 0,
        discounts: [],
      };

      const negativeStockProduct = {
        name: "테스트 상품",
        price: 10000,
        stock: -1,
        discounts: [],
      };

      const zeroStockErrors = validateProduct(zeroStockProduct);
      expect(zeroStockErrors.stock).toBe("재고를 입력해주세요");

      const negativeStockErrors = validateProduct(negativeStockProduct);
      expect(negativeStockErrors.stock).toBe("재고는 0개 이상이어야 합니다");
    });

    test("복합 유효성 검사", () => {
      const invalidProduct = {
        name: "",
        price: -1000,
        stock: -1,
        discounts: [],
      };

      const errors = validateProduct(invalidProduct);
      expect(errors).toEqual({
        name: "상품명을 입력해주세요",
        price: "가격은 0원 이상이어야 합니다",
        stock: "재고는 0개 이상이어야 합니다",
      });
    });
  });

  describe("useProductSearch 훅 테스트 >", () => {
    const testProducts = [
      { id: "1", name: "저가 상품", price: 1000, stock: 10, discounts: [] },
      { id: "2", name: "중가 상품", price: 5000, stock: 10, discounts: [] },
      { id: "3", name: "고가 상품", price: 10000, stock: 10, discounts: [] },
    ];

    test("검색어로 상품을 필터링한다", () => {
      const { result } = renderHook(() => useProductSearch(testProducts));

      act(() => {
        result.current.handleSearch("중가");
      });

      expect(result.current.filteredProducts).toHaveLength(1);
      expect(result.current.filteredProducts[0].name).toBe("중가 상품");
      expect(result.current.totalResults).toBe(1);
    });

    test("가격 범위로 상품을 필터링한다", () => {
      const { result } = renderHook(() => useProductSearch(testProducts));

      act(() => {
        result.current.handlePriceRange(
          {
            target: { value: "2000" },
          } as React.ChangeEvent<HTMLInputElement>,
          "min"
        );
        result.current.handlePriceRange(
          {
            target: { value: "8000" },
          } as React.ChangeEvent<HTMLInputElement>,
          "max"
        );
      });

      expect(result.current.filteredProducts).toHaveLength(1);
      expect(result.current.filteredProducts[0].name).toBe("중가 상품");
    });

    test("검색어와 가격 범위를 조합하여 필터링한다", () => {
      const { result } = renderHook(() => useProductSearch(testProducts));

      act(() => {
        result.current.handleSearch("가");
        result.current.handlePriceRange(
          {
            target: { value: "5000" },
          } as React.ChangeEvent<HTMLInputElement>,
          "min"
        );
      });

      expect(result.current.filteredProducts).toHaveLength(2);
      expect(result.current.filteredProducts.map((p) => p.name)).toEqual([
        "중가 상품",
        "고가 상품",
      ]);
    });
  });

  describe("useLocalStorage 테스트 >", () => {
    beforeEach(() => {
      // 각 테스트 전에 localStorage 초기화
      window.localStorage.clear();
    });

    test("초기값이 없을 때 localStorage에서 값을 가져올 수 있다", () => {
      // localStorage에 미리 값 설정
      window.localStorage.setItem("testKey", JSON.stringify({ test: "value" }));

      const { result } = renderHook(() =>
        useLocalStorage("testKey", { test: "default" })
      );

      expect(result.current[0]).toEqual({ test: "value" });
    });

    test("localStorage에 값이 없을 때 초기값을 사용한다", () => {
      const initialValue = { test: "default" };
      const { result } = renderHook(() =>
        useLocalStorage("testKey", initialValue)
      );

      expect(result.current[0]).toEqual(initialValue);
    });

    test("값을 업데이트하면 localStorage도 업데이트된다", () => {
      const { result } = renderHook(() =>
        useLocalStorage("testKey", { count: 0 })
      );

      act(() => {
        result.current[1]({ count: 1 });
      });

      expect(result.current[0]).toEqual({ count: 1 });
      expect(JSON.parse(window.localStorage.getItem("testKey") || "")).toEqual({
        count: 1,
      });
    });

    test("함수를 통해 값을 업데이트할 수 있다", () => {
      const { result } = renderHook(() =>
        useLocalStorage("testKey", { count: 0 })
      );

      act(() => {
        result.current[1]((prev) => ({ count: prev.count + 1 }));
      });

      expect(result.current[0]).toEqual({ count: 1 });
    });

    test("커스텀 serializer/deserializer를 사용할 수 있다", () => {
      const serializer = (value: Date) => value.toISOString();
      const deserializer = (value: string) => new Date(value);
      const initialDate = new Date("2024-01-01");

      const { result } = renderHook(() =>
        useLocalStorage("testKey", initialDate, { serializer, deserializer })
      );

      expect(result.current[0]).toEqual(initialDate);

      const newDate = new Date("2024-02-01");
      act(() => {
        result.current[1](newDate);
      });

      expect(result.current[0]).toEqual(newDate);
      expect(window.localStorage.getItem("testKey")).toBe(
        newDate.toISOString()
      );
    });

    test("localStorage 에러를 적절히 처리한다", () => {
      // localStorage 접근 에러 시뮬레이션
      const mockConsoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const mockSetItem = vi
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw new Error("Storage full");
        });

      const { result } = renderHook(() =>
        useLocalStorage("testKey", { test: "value" })
      );

      act(() => {
        result.current[1]({ test: "new value" });
      });

      expect(mockConsoleError).toHaveBeenCalled();
      expect(result.current[0]).toEqual({ test: "new value" }); // 메모리상의 값은 업데이트

      mockConsoleError.mockRestore();
      mockSetItem.mockRestore();
    });

    test("다른 창에서의 storage 이벤트를 감지한다", () => {
      const { result } = renderHook(() =>
        useLocalStorage("testKey", { test: "initial" })
      );

      // Storage 이벤트 시뮬레이션
      const storageEvent = new StorageEvent("storage", {
        key: "testKey",
        newValue: JSON.stringify({ test: "updated" }),
        oldValue: JSON.stringify({ test: "initial" }),
        storageArea: localStorage,
      });

      act(() => {
        window.dispatchEvent(storageEvent);
      });

      expect(result.current[0]).toEqual({ test: "updated" });
    });
  });

  describe("useGrades > ", () => {
    test("등급을 초기화할 수 있다.", () => {
      const { result } = renderHook(() => useGrades(mockGrades));
      expect(result.current.grades).toEqual(mockGrades);
    });

    test("등급을 추가할 수 있다", () => {
      const { result } = renderHook(() => useGrades(mockGrades));
      const newGrade: Grade = {
        name: "New Grade",
        rate: 20,
      };

      act(() => {
        result.current.addGrade(newGrade);
      });

      expect(result.current.grades).toHaveLength(2);
      expect(result.current.grades[1]).toEqual(newGrade);
    });
  });

  describe("Cart 순수 함수 테스트 >", () => {
    describe("calculateItemSubtotal >", () => {
      test("상품의 기본 금액을 계산한다", () => {
        const item: CartItem = {
          product: {
            id: "p1",
            name: "상품1",
            price: 10000,
            stock: 20,
            discounts: [],
          },
          quantity: 2,
        };

        expect(calculateItemSubtotal(item)).toBe(20000);
      });
    });

    describe("calculateBulkDiscount >", () => {
      test("수량이 할인 기준을 충족하지 않으면 할인이 적용되지 않는다", () => {
        const item: CartItem = {
          product: {
            id: "p1",
            name: "상품1",
            price: 10000,
            stock: 20,
            discounts: [{ quantity: 10, rate: 0.1 }],
          },
          quantity: 5,
        };

        expect(calculateBulkDiscount(item)).toBe(0);
      });

      test("수량이 할인 기준을 충족하면 할인이 적용된다", () => {
        const item: CartItem = {
          product: {
            id: "p1",
            name: "상품1",
            price: 10000,
            stock: 20,
            discounts: [{ quantity: 10, rate: 0.1 }],
          },
          quantity: 10,
        };

        expect(calculateBulkDiscount(item)).toBe(10000); // 100000 * 0.1
      });

      test("할인 정책이 없는 상품은 할인이 적용되지 않는다", () => {
        const item: CartItem = {
          product: {
            id: "p1",
            name: "상품1",
            price: 10000,
            stock: 20,
            discounts: [],
          },
          quantity: 10,
        };

        expect(calculateBulkDiscount(item)).toBe(0);
      });
    });

    describe("applyCouponDiscount >", () => {
      test("정액 할인 쿠폰을 적용한다", () => {
        const coupon: Coupon = {
          name: "5000원 할인",
          code: "AMOUNT5000",
          discountType: "amount",
          discountValue: 5000,
        };

        expect(applyCouponDiscount(20000, coupon)).toBe(15000);
      });

      test("정률 할인 쿠폰을 적용한다", () => {
        const coupon: Coupon = {
          name: "10% 할인",
          code: "PERCENT10",
          discountType: "percentage",
          discountValue: 10,
        };

        expect(applyCouponDiscount(20000, coupon)).toBe(18000);
      });

      test("쿠폰이 없으면 원래 금액을 반환한다", () => {
        expect(applyCouponDiscount(20000, null)).toBe(20000);
      });
    });

    describe("applyGradeDiscount >", () => {
      test("등급 할인을 적용한다", () => {
        const grade: Grade = {
          name: "VIP",
          rate: 10,
        };

        expect(applyGradeDiscount(20000, grade)).toBe(18000);
      });

      test("등급이 없으면 원래 금액을 반환한다", () => {
        expect(applyGradeDiscount(20000, null)).toBe(20000);
      });

      test("등급 할인율이 0이면 원래 금액을 반환한다", () => {
        const grade: Grade = {
          name: "일반",
          rate: 0,
        };

        expect(applyGradeDiscount(20000, grade)).toBe(20000);
      });
    });
  });
});
