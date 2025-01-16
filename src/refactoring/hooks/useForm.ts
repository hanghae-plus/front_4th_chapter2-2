/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useMemo } from "react";

type FormValues<T> = { [K in keyof T]: T[K] };

type FormState<T> = { [K in keyof T]: T[K] };

interface UseFormReturn<T> {
  register: <K extends keyof T>(
    name: K
  ) => {
    name: K;
    value: T[K];
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  setValue: <K extends keyof T>(name: K, value: T[K]) => void;
  getValue: <K extends keyof T>(name: K) => T[K] | undefined;
  handleSubmit: (
    onSubmit: (values: FormValues<T>) => void
  ) => (e: React.FormEvent) => void;
}

interface UseFormOptions<T> {
  defaultValues?: Partial<T>;
}

export const useForm = <T extends Record<string, any>>(
  options?: UseFormOptions<T>
): UseFormReturn<T> => {
  const initialFormState = useMemo(() => {
    const defaultValues = options?.defaultValues || {};
    return { ...defaultValues } as FormState<T>;
  }, [options?.defaultValues]);

  const [formState, setFormState] = useState<FormState<T>>(initialFormState);

  const updateField = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const register = useCallback(
    <K extends keyof T>(name: K) => ({
      name,
      value: formState[name],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value as unknown as T[K];
        updateField(name, value);
      },
    }),
    [formState, updateField]
  );

  const setValue = useCallback(
    <K extends keyof T>(name: K, value: T[K]) => {
      updateField(name, value);
    },
    [updateField]
  );

  const getValue = useCallback(
    <K extends keyof T>(name: K) => formState[name],
    [formState]
  );

  const handleSubmit = useCallback(
    (onSubmit: (values: FormValues<T>) => void) => (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({ ...formState });
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
