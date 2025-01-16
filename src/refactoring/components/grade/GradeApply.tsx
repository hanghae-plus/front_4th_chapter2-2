import { Grade } from "../../../types";

interface GradeApplyProps {
  grades: Grade[];
  applyGrade: (grade: Grade) => void;
  selectedGrade: Grade | null;
}

function GradeApply(props: GradeApplyProps) {
  const { grades, applyGrade, selectedGrade } = props;
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">등급 적용</h2>
      <select
        onChange={(e) => applyGrade(grades[parseInt(e.target.value)])}
        className="w-full p-2 border rounded mb-2"
      >
        <option value="">등급 선택</option>
        {grades.map((grade, index) => (
          <option key={grade.name} value={index}>
            {grade.name} ({grade.rate}% 할인)
          </option>
        ))}
      </select>
      {selectedGrade && (
        <p className="text-green-600">
          적용된 등급: {selectedGrade.name} ({selectedGrade.rate}% 할인)
        </p>
      )}
    </div>
  );
}

export default GradeApply;
