import { ComponentProps } from 'react';

interface UlProps extends ComponentProps<'ul'> {
  dataList: string[];
}

export function Ul({ dataList, className, ...props }: UlProps) {
  return (
    <ul
      {...props}
      className={`list-disc list-inside text-sm text-gray-500 mb-2 ${className}`}
    >
      {dataList.map((data, index) => (
        <li key={index}>{data}</li>
      ))}
    </ul>
  );
}
