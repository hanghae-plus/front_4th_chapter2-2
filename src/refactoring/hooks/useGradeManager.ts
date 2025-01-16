import { useState } from "react";
import { Grade } from "../../types";

interface Props {
  onGradeAdd: (grade: Grade) => void;
}

function useGradeManager({ onGradeAdd }: Props) {
  const [grade, setGrade] = useState<Grade>({ name: "", rate: 0 });

  const handleAddGrade = () => {
    onGradeAdd(grade);
    setGrade({ name: "", rate: 0 });
  };

  return { grade, setGrade, handleAddGrade };
}

export default useGradeManager;
