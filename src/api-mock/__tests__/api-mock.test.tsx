import { useEffect, useState } from 'react';
import { describe, expect, test } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { AdminPage } from '../../refactoring/components/Admin/AdminPage.tsx';
import { Coupon, Product } from '../../types';
import { userEvent } from '@testing-library/user-event';

const TestAdminPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const handleProductUpdate = (updatedProduct: Product) => {
    fetch(`http://localhost:3000/products/${updatedProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts((prevProducts) =>
          // eslint-disable-next-line sonarjs/no-nested-functions
          prevProducts.map((p) => (p.id === data.id ? updatedProduct : p)),
        );
      });
  };

  const handleProductAdd = (newProduct: Product) => {
    fetch('http://localhost:3000/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      });
  };

  const handleCouponAdd = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  // initial fetch
  useEffect(() => {
    const fetchProductList = () => {
      fetch('http://localhost:3000/products')
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
        });
    };
    const fetchCouponList = () => {
      fetch('http://localhost:3000/coupons')
        .then((res) => res.json())
        .then((data) => {
          setCoupons(data);
        });
    };

    fetchProductList();
    fetchCouponList();
  }, []);

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

describe('api-mock > ', () => {
  describe('시나리오 테스트 > ', () => {
    test('관리자 페이지 테스트 > ', async () => {
      render(<TestAdminPage />);

      const $product1 = await screen.findByTestId('product-1');

      // 1. 새로운 상품 추가
      fireEvent.click(await screen.findByText('새 상품 추가'));

      fireEvent.change(screen.getByLabelText('상품명'), { target: { value: '상품4' } });
      fireEvent.change(screen.getByLabelText('가격'), { target: { value: '15000' } });
      fireEvent.change(screen.getByLabelText('재고'), { target: { value: '30' } });

      fireEvent.click(await screen.findByText('추가'));

      const $product4 = await screen.findByTestId('product-4');

      expect($product4).toHaveTextContent('상품4');
      expect($product4).toHaveTextContent('15000원');
      expect($product4).toHaveTextContent('재고: 30');

      // 2. 상품 선택 및 수정
      fireEvent.click($product1);
      fireEvent.click(await within($product1).findByTestId('toggle-button'));
      fireEvent.click(await within($product1).findByTestId('modify-button'));

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue('20'), { target: { value: '25' } });
        fireEvent.change(within($product1).getByDisplayValue('10000'), {
          target: { value: '12000' },
        });
        fireEvent.change(within($product1).getByDisplayValue('상품1'), {
          target: { value: '수정된 상품1' },
        });
      });

      await userEvent.click(await within($product1).findByText('수정 완료'));

      expect($product1).toHaveTextContent('수정된 상품1');
      expect($product1).toHaveTextContent('12000원');
      expect($product1).toHaveTextContent('재고: 25');

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1);
      fireEvent.click(await within($product1).findByTestId('modify-button'));

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('수량'), { target: { value: '5' } });
        fireEvent.change(screen.getByPlaceholderText('할인율 (%)'), { target: { value: '5' } });
      });
      await userEvent.click(await screen.findByText('할인 추가'));

      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument();

      // 할인 삭제
      fireEvent.click((await screen.findAllByText('삭제'))[0]);
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument();
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument();

      fireEvent.click((await screen.findAllByText('삭제'))[0]);
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument();
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).not.toBeInTheDocument();

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText('쿠폰 이름'), { target: { value: '새 쿠폰' } });
      fireEvent.change(screen.getByPlaceholderText('쿠폰 코드'), { target: { value: 'NEW10' } });
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'percentage' } });
      fireEvent.change(screen.getByPlaceholderText('할인 값'), { target: { value: '10' } });

      fireEvent.click(await screen.findByText('쿠폰 추가'));

      const $newCoupon = await screen.findByTestId('coupon-3');

      expect($newCoupon).toHaveTextContent('새 쿠폰 (NEW10):10% 할인');
    });
  });
});
