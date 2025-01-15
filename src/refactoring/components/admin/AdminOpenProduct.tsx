import { useOpenProductIds } from '../../hooks/useOpenProductIds';

interface AdminOpenProductProps {
  children: React.ReactNode;
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
  };
}

export const AdminOpenProduct = ({ children, product }: AdminOpenProductProps) => {
  const { openProductIds, toggleProductAccordion } = useOpenProductIds();

  return (
    <>
      <button
        data-testid='toggle-button'
        onClick={() => toggleProductAccordion(product.id)}
        className='w-full text-left font-semibold'
      >
        {product.name} - {product.price}원 (재고: {product.stock})
      </button>
      {openProductIds.has(product.id) && children}
    </>
  );
};
