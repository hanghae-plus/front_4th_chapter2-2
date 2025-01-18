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
// ! 행동(부수효과) 계산 데이터의 측면으로 보자면... -> 괜찮은지도?
// ! 관심사의 분리 측면(이것도 사실 추상화의 일종인듯? 행동(부수효과) 계산 데이터 단위의 추상화와 features 단위의 추상화...)으로 보자면... -> 괜찮은지도?
// ! 언제든지 다른 걸로 바꿔끼워넣을 수 있나? -> 나쁘지 않은지도? 다만 자유롭게 ui를 조합해서 만들 수 있도록 한다면 더 괜찮을지도?
