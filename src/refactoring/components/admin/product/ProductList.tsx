import { Product } from "../../../../types";
import Button from "../../common/Button";
import ProductUpdateForm from "./ProductUpdateForm";

interface ProductListProps {
  products: Array<Product>;
  openProductIds: Set<string>;
  editingProductId: string | null;
  onToggleAccordion: (productId: string) => void;
  onStartEdit: React.Dispatch<React.SetStateAction<string | null>>;
  onProductUpdate: (updatedProduct: Product) => void;
}

const ProductList = ({
  products,
  openProductIds,
  editingProductId,
  onToggleAccordion,
  onStartEdit,
  onProductUpdate,
}: ProductListProps) => {
  return (
    <div className="space-y-2">
      {products.map((product, index) => (
        <div
          key={product.id}
          data-testid={`product-${index + 1}`}
          className="bg-white p-4 rounded shadow"
        >
          <button
            data-testid="toggle-button"
            onClick={() => onToggleAccordion(product.id)}
            className="w-full text-left font-semibold"
          >
            {product.name} - {product.price}원 (재고: {product.stock})
          </button>
          {openProductIds.has(product.id) && (
            <div className="mt-2">
              {editingProductId && editingProductId === product.id ? (
                <ProductUpdateForm
                  product={product}
                  onUpdate={onProductUpdate}
                  onClose={onStartEdit}
                />
              ) : (
                <div>
                  {product.discounts.map((discount, index) => (
                    <div key={index} className="mb-2">
                      <span>
                        {discount.quantity}개 이상 구매 시 {discount.rate * 100}
                        % 할인
                      </span>
                    </div>
                  ))}
                  <Button
                    data-testid="modify-button"
                    onClick={() => onStartEdit(product.id)}
                    className="px-2 py-1 mt-2"
                  >
                    수정
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
