import { CartPage } from "./components/CartPage.tsx";
import { AdminPage } from "./components/AdminPage.tsx";
import { useCoupons } from "./hooks";
import { initialProducts } from "./entity/products.ts";
import { initialCoupons } from "./entity/coupons.ts";
import { Navigation } from "./components/Navigation.tsx";
import { useAdmin } from "./hooks/useAdmin.ts";
import { ProductsProvider } from "./contexts/ProductsContext.tsx";

const App = () => {
  // App의 관심사: products, coupons, isAdmin을 통해 모든 ui를 관리하면서 렌더링한다.
  const { coupons, addCoupon } = useCoupons(initialCoupons);
  const { isAdmin, changeRole } = useAdmin();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation isAdmin={isAdmin} onRoleChange={changeRole} />
      <main className="container mx-auto mt-6">
        <ProductsProvider initialProducts={initialProducts}>
          {isAdmin ? (
            <AdminPage coupons={coupons} onCouponAdd={addCoupon} />
          ) : (
            <CartPage coupons={coupons} />
          )}
        </ProductsProvider>
      </main>
    </div>
  );
};

export default App;

// Todo: 1. AdminPage 컨텍스트로 분리 -> 테스트에서 실패나네.. 어쩔 수 없는 과정이려나.
// Todo: 2. CartPage 리팩토링
// Todo: 3. Discount도 context로 분리해야하려나?
// ! 이게 계층적으로 잘 분리된 코드인지 잘 모르겠음...
