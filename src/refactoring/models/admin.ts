export const calculateQuantity = (value: string): number => {
	return parseInt(value) || 0;
};

export const calculateRate = (value: string): number => {
  return (parseInt(value) || 0) / 100;
};
