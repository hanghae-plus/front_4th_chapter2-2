export type ValidationResult = {
  isValid: boolean;
  message?: string;
};

export type Validator<Filed> = (value: Filed) => ValidationResult;

export const createValidators = <Filed>() => ({
  required:
    (message = "필수 입력값입니다"): Validator<Filed> =>
    (value) => ({
      isValid: Array.isArray(value)
        ? value.length > 0
        : typeof value === "string"
        ? value.trim().length > 0
        : value !== undefined && value !== null,
      message,
    }),

  min:
    (min: number, message = `${min}자 이상 입력하세요`): Validator<Filed> =>
    (value) => ({
      isValid: String(value).length >= min,
      message,
    }),

  max:
    (max: number, message = `${max}자 이하로 입력하세요`): Validator<Filed> =>
    (value) => ({
      isValid: String(value).length <= max,
      message,
    }),

  custom:
    (
      validationFn: (value: Filed) => boolean,
      message: string
    ): Validator<Filed> =>
    (value) => ({
      isValid: validationFn(value),
      message,
    }),
});

export const validateField = <Filed>(
  value: Filed,
  validatorList: Array<Validator<Filed>>
): string | undefined => {
  for (const validator of validatorList) {
    const result = validator(value);
    if (!result.isValid) {
      return result.message;
    }
  }
  return undefined;
};
