import { useProducts } from "../../../../hooks";
import { useForm } from "../../../../hooks/useForm";
import { ProductEditForm } from "./productEditForm/ProductEditForm";

export const ProductList = () => {
  const { products, openProductIds } = useProducts();
  const { toggleProductAccordion } = useForm();
  return (
    <div>
      <div className="space-y-2">
        {products.map((product, index) => (
          <div
            key={product.id}
            data-testid={`product-${index + 1}`}
            className="bg-white p-4 rounded shadow"
          >
            <button
              data-testid="toggle-button"
              onClick={() => toggleProductAccordion(product)}
              className="w-full text-left font-semibold"
            >
              {product.name} - {product.price}원 (재고: {product.stock})
            </button>
            {openProductIds.get(product.id) && (
              <ProductEditForm productId={product.id} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
