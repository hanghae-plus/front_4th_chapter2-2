import { useState } from 'react';
import { CartPage } from '../pages/cart/ui/CartPage.tsx';
import { AdminPage } from '../pages/admin/ui/AdminPage.tsx';
import { Layout } from './Layout.tsx';
import { ProductContextProvider } from './providers/ProductContextProvider.tsx';
import { CouponContextProvider } from './providers';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <ProductContextProvider>
      <CouponContextProvider>
        <Layout isAdmin={isAdmin} setIsAdmin={setIsAdmin}>
          {isAdmin ? <AdminPage /> : <CartPage />}
        </Layout>
      </CouponContextProvider>
    </ProductContextProvider>
  );
};

export default App;
