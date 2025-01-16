import { Coupon, Grade, Product } from "../../types.ts";
import CouponAdminSection from "../components/coupon/CouponAdminSection/index.tsx";
import ProductManagementSection from "../components/product/ProductManagementSection/index.tsx";
import useGradeManager from "../hooks/useGradeManager.ts";

interface Props {
  products: Product[];
  coupons: Coupon[];
  grades: Grade[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
  onGradeAdd: (newGrade: Grade) => void;
}

export const AdminPage = (props: Props) => {
  const {
    products,
    coupons,
    grades,
    onProductUpdate,
    onProductAdd,
    onCouponAdd,
    onGradeAdd,
  } = props;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProductManagementSection
          products={products}
          onProductUpdate={onProductUpdate}
          onProductAdd={onProductAdd}
        />
        <CouponAdminSection onCouponAdd={onCouponAdd} coupons={coupons} />
        <GradeSection grades={grades} onGradeAdd={onGradeAdd} />
      </div>
    </div>
  );
};

function GradeSection({
  grades,
  onGradeAdd,
}: {
  grades: Grade[];
  onGradeAdd: (newGrade: Grade) => void;
}) {
  const { grade, setGrade, handleAddGrade } = useGradeManager({ onGradeAdd });
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">등급 관리</h2>
      <div className="bg-white p-4 rounded shadow">
        <GradeAddForm
          grade={grade}
          setGrade={setGrade}
          handleAddGrade={handleAddGrade}
        />
        <GradeList grades={grades} />
      </div>
    </div>
  );
}

function GradeAddForm({
  grade,
  setGrade,
  handleAddGrade,
}: {
  grade: Grade;
  setGrade: (grade: Grade) => void;
  handleAddGrade: () => void;
}) {
  return (
    <div className="space-y-2 mb-4">
      <input
        type="text"
        placeholder="등급 이름"
        value={grade.name}
        onChange={(e) => setGrade({ ...grade, name: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="등급 기준 금액"
        value={grade.rate}
        onChange={(e) => setGrade({ ...grade, rate: Number(e.target.value) })}
        className="w-full p-2 border rounded"
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleAddGrade}
      >
        등급 추가
      </button>
    </div>
  );
}

function GradeList({ grades }: { grades: Grade[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
      <div className="space-y-2">
        {grades.map((grade, index) => (
          <GradeItem key={index} grade={grade} />
        ))}
      </div>
    </div>
  );
}

function GradeItem({ grade }: { grade: Grade }) {
  return (
    <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
      <span>{grade.name}</span>
      <span>{grade.rate}%</span>
    </div>
  );
}
