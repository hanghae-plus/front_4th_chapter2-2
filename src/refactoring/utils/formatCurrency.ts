interface CurrencyFormatOptions {
  locale?: string;
  currency?: string;
  hideCurrencySymbol?: boolean;
}

export const formatCurrency = (amount: number, options: CurrencyFormatOptions = {}): string => {
  const { locale = 'ko-KR', currency = 'KRW', hideCurrencySymbol = false } = options;

  if (typeof amount !== 'number' || isNaN(amount)) {
    return '0';
  }

  if (hideCurrencySymbol) {
    return amount.toLocaleString(locale);
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'narrowSymbol',
  }).format(amount);
};
