import { Product } from "../../types";

interface Props {
  editingProduct: Product;
  productId: string;
  onProductNameUpdate: (productId: string, name: string) => void;
  onProductPriceUpdate: (productId: string, price: number) => void;
  onStockUpdate: (productId: string, stock: number) => void;
}

export const ProductEditForm = ({
  editingProduct,
  productId,
  onProductNameUpdate,
  onProductPriceUpdate,
  onStockUpdate,
}: Props) => {
  return (
    <div>
      <div className="mb-4">
        <label className="block mb-1">상품명: </label>
        <input
          type="text"
          value={editingProduct.name}
          onChange={(e) => onProductNameUpdate(productId, e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">가격: </label>
        <input
          type="number"
          value={editingProduct.price}
          onChange={(e) =>
            onProductPriceUpdate(productId, parseInt(e.target.value))
          }
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">재고: </label>
        <input
          type="number"
          value={editingProduct.stock}
          onChange={(e) => onStockUpdate(productId, parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
};
