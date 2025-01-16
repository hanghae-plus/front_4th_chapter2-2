interface UlProps {
  dataList: string[];
}

export function Ul({ dataList }: UlProps) {
  return (
    <ul className="list-disc list-inside text-sm text-gray-500 mb-2">
      {dataList.map((data, index) => (
        <li key={index}>{data}</li>
      ))}
    </ul>
  );
}
