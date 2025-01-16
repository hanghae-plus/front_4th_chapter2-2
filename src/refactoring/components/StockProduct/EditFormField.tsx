import { FormField, FormFieldProps } from "../../shared/_components/FormField";

export const EditFormField = (props: FormFieldProps) => {
  return (
    <FormField
      className="mb-4"
      labelClassName="block mb-1"
      inputClassName="w-full p-2 border rounded"
      {...props}
    />
  );
};
