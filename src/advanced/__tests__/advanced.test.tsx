import { ChangeEvent, useState } from "react";
import { vi, beforeEach, describe, expect, test } from "vitest";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  within,
} from "@testing-library/react";
import { Coupon, Product } from "../../types";
import { CartPage } from "../../refactoring/pages/CartPage.tsx";
import { AdminPage } from "../../refactoring/pages/AdminPage.tsx";
import {
  storageManager,
  formatCurrency,
  debounce,
} from "../../refactoring/utils";
import {
  useForm,
  useLocalStorage,
  useProductSearch,
} from "../../refactoring/hooks";

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

const mockStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (index: number) => Object.keys(store)[index] || null,
    get length() {
      return Object.keys(store).length;
    },
  } as Storage;
})();

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
        screen.queryByText("5개 이상 구매 시 5% 할인"),
      ).toBeInTheDocument();

      // 할인 삭제
      fireEvent.click(screen.getAllByText("삭제")[0]);
      expect(
        screen.queryByText("10개 이상 구매 시 10% 할인"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("5개 이상 구매 시 5% 할인"),
      ).toBeInTheDocument();

      fireEvent.click(screen.getAllByText("삭제")[0]);
      expect(
        screen.queryByText("10개 이상 구매 시 10% 할인"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("5개 이상 구매 시 5% 할인"),
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

  describe("storageManager 테스트 >", () => {
    beforeEach(() => {
      Object.defineProperty(window, "localStorage", {
        value: mockStorage,
      });
      localStorage.clear();
    });

    test("데이터 저장/조회 테스트 >", () => {
      const key = "test";
      const value = "test value";
      const { get, set } = storageManager<string>(key, mockStorage);

      set(value);
      expect(get()).toBe(value);
    });

    test("데이터 삭제 테스트 >", () => {
      const key = "test";
      const value = "test value";
      const { get, set, reset } = storageManager<string>(key, mockStorage);

      set(value);
      expect(get()).toBe(value);

      reset();
      expect(get()).toBeNull();
    });
  });

  describe("useLocalStorage 테스트 >", () => {
    beforeEach(() => {
      Object.defineProperty(window, "localStorage", {
        value: mockStorage,
      });
      localStorage.clear();
    });

    test("초기 값 설정 테스트 >", () => {
      const key = "testKey";
      const initialValue = "initialValue";
      const { result } = renderHook(() => useLocalStorage(key, initialValue));

      expect(result.current[0]).toBe(initialValue);
    });

    test("상태 업데이트 테스트 >", () => {
      const key = "testKey";
      const initialValue = "initialValue";
      const { result } = renderHook(() => useLocalStorage(key, initialValue));

      act(() => {
        result.current[1]("newValue");
      });

      expect(result.current[0]).toBe("newValue");
      expect(window.localStorage.getItem(key)).toBe(JSON.stringify("newValue"));
    });

    test("새로 고침 테스트 >", () => {
      const key = "testKey";
      const initialValue = "initialValue";

      const { result, unmount } = renderHook(() =>
        useLocalStorage(key, initialValue),
      );

      act(() => {
        result.current[1]("newValue");
      });

      expect(result.current[0]).toBe("newValue");
      expect(window.localStorage.getItem(key)).toBe(JSON.stringify("newValue"));

      unmount();

      const { result: refreshedResult } = renderHook(() =>
        useLocalStorage(key, null),
      );

      expect(refreshedResult.current[0]).toBe("newValue");
    });
  });

  describe("useForm hook 테스트 >", () => {
    interface TestFormValues {
      name: string;
      email: string;
    }

    const initialValues: TestFormValues = {
      name: "",
      email: "",
    };

    const testname = "test name";
    const testemail = "test@test.com";

    test("초기값 설정 테스트 >", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          onSubmit: vi.fn(),
        }),
      );

      expect(result.current.values).toEqual(initialValues);
    });

    test("handleChange 테스트 >", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          onSubmit: vi.fn(),
        }),
      );

      act(() => {
        result.current.handleChange("name", testname);
        result.current.handleChange("email", testemail);
      });

      expect(result.current.values).toEqual({
        name: testname,
        email: testemail,
      });
    });

    test("onSubmit 테스트 >", () => {
      const onSubmitMock = vi.fn();

      const { result } = renderHook(() =>
        useForm({
          initialValues,
          onSubmit: onSubmitMock,
        }),
      );

      act(() => {
        result.current.handleChange("name", testname);
        result.current.handleChange("email", testemail);
      });

      act(() => {
        result.current.handleSubmit();
      });

      expect(onSubmitMock).toHaveBeenCalledWith({
        name: testname,
        email: testemail,
      });
    });

    test("resetForm 테스트 >", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          onSubmit: vi.fn(),
        }),
      );

      act(() => {
        result.current.handleChange("name", "changed name");
        result.current.handleChange("email", "changeEmail@test.com");
      });

      expect(result.current.values).toEqual({
        name: "changed name",
        email: "changeEmail@test.com",
      });

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.values).toEqual(initialValues);
    });
  });

  describe("formatCurrency 함수 테스트 >", () => {
    test("숫자를 한국 통화로 변경하는지 테스트 >", () => {
      const result1 = formatCurrency(10000);
      const result2 = formatCurrency(1000000);

      expect(result1).toBe("10,000원");
      expect(result2).toBe("1,000,000원");
    });
  });

  describe("useProductSearch hook 테스트", () => {
    test("검색어가 입력되지 않았을 때 모든 제품을 반환 >", () => {
      const { result } = renderHook(() => useProductSearch(mockProducts));

      expect(result.current.filteredProducts).toEqual(mockProducts);
    });

    test("검색어에 따라 제품을 필터링 >", () => {
      const { result } = renderHook(() => useProductSearch(mockProducts));

      act(() => {
        result.current.handleSearch({
          target: { value: "상품1" },
        } as ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.filteredProducts).toEqual([
        {
          id: "p1",
          name: "상품1",
          price: 10000,
          stock: 20,
          discounts: [{ quantity: 10, rate: 0.1 }],
        },
      ]);
    });

    test("검색어와 일치하는 제품이 없을 경우 빈 배열을 반환 >", () => {
      const { result } = renderHook(() => useProductSearch(mockProducts));

      act(() => {
        result.current.handleSearch({
          target: { value: "없는상품" },
        } as ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.filteredProducts).toEqual([]);
    });

    test("대소문자를 구분 하지 않아야 한다 >", () => {
      const { result } = renderHook(() => useProductSearch(mockProducts));

      act(() => {
        result.current.handleSearch({
          target: { value: "상품2" },
        } as ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.filteredProducts).toEqual([
        {
          id: "p2",
          name: "상품2",
          price: 20000,
          stock: 20,
          discounts: [{ quantity: 10, rate: 0.15 }],
        },
      ]);
    });
  });

  describe("debounce 함수 테스트", () => {
    test("지정된 딜레이 이후에 함수가 호출되어야 한다", async () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 300);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      // 300ms 이후에 호출되는지 확인
      await new Promise((resolve) => setTimeout(resolve, 300));
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test("딜레이 시간 내에 여러 번 호출되면 타이머가 초기화되어야 한다", async () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 300);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      // 300ms 전에 호출되지 않음
      expect(mockFn).not.toHaveBeenCalled();

      // 300ms 이후에 한 번만 호출됨
      await new Promise((resolve) => setTimeout(resolve, 300));
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test("올바른 인자가 함수에 전달되어야 한다", async () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 300);

      debouncedFn("arg1", 42);
      await new Promise((resolve) => setTimeout(resolve, 300));

      expect(mockFn).toHaveBeenCalledWith("arg1", 42);
    });

    test("충분한 시간이 지나지 않으면 함수가 호출되지 않아야 한다", async () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 300);

      debouncedFn();
      await new Promise((resolve) => setTimeout(resolve, 200)); // 300ms보다 짧은 시간
      expect(mockFn).not.toHaveBeenCalled();
    });

    test("빠른 연속 호출도 올바르게 처리되어야 한다", async () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 300);

      debouncedFn();
      await new Promise((resolve) => setTimeout(resolve, 100)); // 첫 번째 호출 이후 100ms
      debouncedFn();
      await new Promise((resolve) => setTimeout(resolve, 100)); // 두 번째 호출 이후 100ms
      debouncedFn();

      await new Promise((resolve) => setTimeout(resolve, 300)); // 마지막 호출 이후 300ms
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
