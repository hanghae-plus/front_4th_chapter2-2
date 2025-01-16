import { useState, useCallback } from "react";

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => void;
}

export const useForm = <T extends object>({
  initialValues,
  onSubmit,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = useCallback((name: keyof T, value: T[keyof T]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit(values);
  }, [onSubmit, values]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  return {
    values,
    handleChange,
    handleSubmit,
    resetForm,
  };
};
