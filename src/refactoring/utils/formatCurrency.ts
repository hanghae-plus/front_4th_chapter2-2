export const formatCurrency = (value: number): string => {
  return value.toLocaleString("ko-KR") + "원";
};
