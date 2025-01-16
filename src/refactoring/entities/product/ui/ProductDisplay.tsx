import { Product } from '../../../../types';

export interface ProductDisplayProps {
  product: Product;
  testId?: string;
  className?: string;
  children: React.ReactNode;
}

export function ProductDisplay({
  product,
  testId = `product-${product.id}`,
  className = '',
  children,
}: ProductDisplayProps) {
  return (
    <div
      data-testid={testId}
      key={product.id}
      className={`bg-white p-3 rounded shadow ${className}`}
    >
      {children}
    </div>
  );
}
