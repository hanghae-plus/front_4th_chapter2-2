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
    return new Intl.NumberFormat(locale).format(amount);
  }

  const formatOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
  };

  if (locale === 'ko-KR' || locale === 'id-ID') {
    formatOptions.maximumFractionDigits = 0;
    formatOptions.minimumFractionDigits = 0;
  }

  if (currency === 'USD') {
    formatOptions.maximumFractionDigits = 2;
    formatOptions.minimumFractionDigits = 2;
  }

  let formatted = new Intl.NumberFormat(locale, formatOptions).format(amount);

  if (currency === 'IDR') {
    formatted = formatted.replace(/\s/g, '\u00a0');
  }

  return formatted;
};
