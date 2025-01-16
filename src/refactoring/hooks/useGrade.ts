import { Grade } from "../../types";
import { useLocalStorage } from "./useLocalStorage";

export const useGrades = (initialGrades: Grade[]) => {
  const [grades, setGrades] = useLocalStorage<Grade[]>("grades", initialGrades);

  const addGrade = (grade: Grade) => {
    setGrades((prevGrades) => [...prevGrades, grade]);
  };

  return { grades, addGrade };
};
