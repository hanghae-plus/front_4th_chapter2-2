import AddProduct from '../../features/products/admin/AddProduct';
import ProductList from '../../features/products/admin/ProductList';

function ProductManagementWidget() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
      <AddProduct />
      <ProductList />
    </div>
  );
}

export default ProductManagementWidget;
