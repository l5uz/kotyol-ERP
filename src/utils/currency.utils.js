import { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY_CODE } from '@/shared/currencies';

export const formatCurrency = (amount, currencyCode = DEFAULT_CURRENCY_CODE) => {
  const num = Number(amount) || 0;
  const currencyObj = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES[DEFAULT_CURRENCY_CODE];

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyObj.code,
      minimumFractionDigits: 2,
    }).format(num);
  } catch {
    return `${currencyObj.symbol}${num.toFixed(2)}`;
  }
};
