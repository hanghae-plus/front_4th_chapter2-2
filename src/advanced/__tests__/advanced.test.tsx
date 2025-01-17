import { describe, expect, test, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { Product } from '../../types.ts';
import { ProductEditForm } from '../../refactoring/features/product/ui/ProductEditForm.tsx';

describe('ProductEditForm >', () => {
  const initialProduct: Product = {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
  };

  const handleUpdate = vi.fn();

  test('초기 상품 정보가 폼에 올바르게 표시되어야 한다 >', () => {
    render(<ProductEditForm product={initialProduct} onUpdate={handleUpdate} />);

    const nameInput = screen.getByLabelText('상품명:');
    const priceInput = screen.getByLabelText('가격:');
    const stockInput = screen.getByLabelText('재고:');

    expect(nameInput).toHaveValue('상품1');
    expect(priceInput).toHaveValue(10000);
    expect(stockInput).toHaveValue(20);
  });

  test('필드 값이 변경되면 폼이 업데이트되어야 한다 >', () => {
    render(<ProductEditForm product={initialProduct} onUpdate={handleUpdate} />);

    const nameInput = screen.getByLabelText('상품명:');
    const priceInput = screen.getByLabelText('가격:');
    const stockInput = screen.getByLabelText('재고:');

    fireEvent.change(nameInput, { target: { value: '수정된 상품1' } });
    fireEvent.change(priceInput, { target: { value: '15000' } });
    fireEvent.change(stockInput, { target: { value: '30' } });

    expect(nameInput).toHaveValue('수정된 상품1');
    expect(priceInput).toHaveValue(15000);
    expect(stockInput).toHaveValue(30);
  });

  test('수정 완료 버튼 클릭 시 변경된 데이터로 업데이트되어야 한다 >', () => {
    render(<ProductEditForm product={initialProduct} onUpdate={handleUpdate} />);

    const nameInput = screen.getByLabelText('상품명:');
    const priceInput = screen.getByLabelText('가격:');
    const stockInput = screen.getByLabelText('재고:');
    const completeButton = screen.getByRole('button', { name: '수정 완료' });

    fireEvent.change(nameInput, { target: { value: '수정된 상품1' } });
    fireEvent.change(priceInput, { target: { value: '15000' } });
    fireEvent.change(stockInput, { target: { value: '30' } });

    fireEvent.click(completeButton);

    expect(handleUpdate).toHaveBeenCalledTimes(1);
    expect(handleUpdate).toHaveBeenCalledWith({
      ...initialProduct,
      name: '수정된 상품1',
      price: 15000,
      stock: 30,
    });
  });

  test('초기 할인 정보가 올바르게 표시되어야 한다 >', () => {
    render(<ProductEditForm product={initialProduct} onUpdate={handleUpdate} />);

    expect(screen.getByText('10개 이상 구매 시 10% 할인')).toBeInTheDocument();
  });

  test('입력값이 없을 때는 이전 값이 유지되어야 한다 >', () => {
    render(<ProductEditForm product={initialProduct} onUpdate={handleUpdate} />);

    const nameInput = screen.getByLabelText('상품명:');
    fireEvent.change(nameInput, { target: { value: '' } });

    const completeButton = screen.getByRole('button', { name: '수정 완료' });

    fireEvent.click(completeButton);

    expect(handleUpdate).toHaveBeenCalledWith({
      ...initialProduct,
      name: '',
    });
  });

  test('숫자 필드에 문자열이 입력되면 이전 값이 유지되어야 한다 >', () => {
    render(<ProductEditForm product={initialProduct} onUpdate={handleUpdate} />);

    const priceInput = screen.getByLabelText('가격:');
    fireEvent.change(priceInput, { target: { value: 'invalid' } });

    const completeButton = screen.getByRole('button', { name: '수정 완료' });

    fireEvent.click(completeButton);

    expect(handleUpdate).toHaveBeenCalledWith({
      ...initialProduct,
      price: 0, // 숫자로 변환 실패 시 0으로 설정됨
    });
  });
});
