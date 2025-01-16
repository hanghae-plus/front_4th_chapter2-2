import { useAppState } from './hooks';
import { CartPage } from './pages/CartPage';
import { AdminPage } from './pages/AdminPage';
import { NavBar } from './components/NavBar';

const App = () => {
  const { isAdmin, toggleAdmin, productList, couponList, updateProduct, addProduct, addCoupon } =
    useAppState();

  return (
    <div className='min-h-screen bg-gray-100'>
      <NavBar isAdmin={isAdmin} toggleAdmin={toggleAdmin} />
      <main className='container mx-auto mt-6'>
        {isAdmin ? (
          <AdminPage
            productList={productList}
            couponList={couponList}
            onProductUpdate={updateProduct}
            onProductAdd={addProduct}
            onCouponAdd={addCoupon}
          />
        ) : (
          <CartPage productList={productList} couponList={couponList} />
        )}
      </main>
    </div>
  );
};

export default App;
