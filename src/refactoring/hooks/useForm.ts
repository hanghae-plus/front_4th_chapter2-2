import { useState, useCallback, useMemo } from "react";

type FormValues<T> = T;

interface FormField<T> {
  value: T;
}

type FormState<T> = Record<string, FormField<T>>;

interface UseFormReturn<T> {
  register: (name: string) => {
    name: string;
    value: T;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  setValue: (name: string, value: T) => void;
  getValue: (name: string) => FormField<T> | undefined;
  handleSubmit: (
    onSubmit: (values: FormValues<T>) => void
  ) => (e: React.FormEvent) => void;
}

interface DefaultValues<T> {
  [key: string]: T;
}

interface UseFormOptions {
  defaultValues?: DefaultValues<unknown>;
}

export const useForm = <T>(options?: UseFormOptions): UseFormReturn<T> => {
  const initialFormState = useMemo(() => {
    const defaultValues = options?.defaultValues || {};

    return Object.keys(defaultValues).reduce((acc, key) => {
      return {
        ...acc,
        [key]: defaultValues[key] as FormField<T>,
      };
    }, {} as FormState<T>);
  }, [options?.defaultValues]);

  const [formState, setFormState] = useState<FormState<T>>(initialFormState);

  const updateField = useCallback((name: string, updates: T) => {
    setFormState((prev) => ({
      ...prev,
      [name]: updates as FormField<T>,
    }));
  }, []);

  const register = useCallback(
    (name: string) => ({
      name,
      value: formState[name]?.value as T,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value as unknown as T;
        updateField(name, value);
      },
    }),
    [formState, updateField]
  );

  const setValue = useCallback(
    (name: string, value: T) => {
      updateField(name, value);
    },
    [updateField]
  );

  const getValue = useCallback((name: string) => formState[name], [formState]);

  const handleSubmit = useCallback(
    (onSubmit: (values: FormValues<T>) => void) => (e: React.FormEvent) => {
      e.preventDefault();
      const values = Object.entries(formState).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value }),
        {} as FormValues<T>
      );

      onSubmit(values);
    },
    [formState]
  );

  return {
    register,
    setValue,
    getValue,
    handleSubmit,
  };
};
