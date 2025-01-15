import { useState } from 'react';
import { CartPage } from '../pages/user/CartPage.tsx';
import { AdminPage } from '../pages/admin/AdminPage.tsx';
import Header from '../pages/shared/Header.tsx';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const swapRoleHandler = () => {
    setIsAdmin((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header isAdmin={isAdmin} onSwapRole={swapRoleHandler} />
      <main className="container mx-auto mt-6">{isAdmin ? <AdminPage /> : <CartPage />}</main>
    </div>
  );
};

export default App;
