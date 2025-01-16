import { useCallback, useState } from 'react';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface UseFormProps<T> {
  initialValues: T;
  validate?: (values: T) => ValidationResult;
  onSubmit: (values: T) => void;
  onReset?: () => void;
}

interface UseFormReturn<T> {
  values: T;
  errors: string[];
  handleChange: <K extends keyof T>(key: K, value: T[K]) => void;
  handleSubmit: () => void;
  resetForm: () => void;
  isValid: boolean;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
  onReset,
}: UseFormProps<T>): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors([]);
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors([]);
    onReset?.();
  }, [initialValues, onReset]);

  const handleSubmit = useCallback(() => {
    if (validate) {
      const validation = validate(values);
      setErrors(validation.errors);

      if (!validation.isValid) {
        return false;
      }
    }

    onSubmit(values);
    resetForm();
    return true;
  }, [values, validate, onSubmit, resetForm]);

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    isValid: errors.length === 0,
  };
};
