import React from 'react';

interface InputFieldWithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  children: React.ReactNode;
}

export const InputFieldWithLabel = ({ children, id, ...props }: InputFieldWithLabelProps) => {
  return (
    <>
      <label className="block text-sm font-medium text-gray-700" htmlFor={id}>
        {children}
      </label>
      <input className="w-full rounded border p-2" id={id} {...props} />
    </>
  );
};
