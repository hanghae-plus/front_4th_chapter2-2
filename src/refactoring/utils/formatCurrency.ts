export const formatCurrency = (amount: number | string, locale: string = 'ko-KR'): string => {
  try {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numericAmount)) {
      throw new Error('Invalid amount');
    }

    const formatter = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    });

    return `${formatter.format(numericAmount)}`;
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${amount.toLocaleString()}`;
  }
};
