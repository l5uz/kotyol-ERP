import { DEFAULT_CURRENCY_CODE } from '@/shared/currencies';

export const getActiveCurrency = () => {
  try {
    const saved = localStorage.getItem('selected_currency') || localStorage.getItem('company_currency');
    if (saved) return saved.toUpperCase();
  } catch {}
  return 'USD';
};

export const getCurrencySymbol = (overrideCode) => {
  const code = (overrideCode || getActiveCurrency() || 'USD').toUpperCase();
  if (code === 'UZS' || code === "SO'M" || code === 'SOM' || code === 'SUM') {
    return "so'm";
  }
  return '$';
};

export const parseRawNumber = (val) => {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const clean = String(val).replace(/[\s\u00A0]/g, '').replace(/,/g, '.');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
};

export const formatCurrency = (amount, currencyCode) => {
  const num = parseRawNumber(amount);
  const code = (currencyCode || getActiveCurrency() || 'USD').toUpperCase();

  if (code === 'UZS' || code === "SO'M" || code === 'SOM' || code === 'SUM') {
    return `${num.toLocaleString('uz-UZ')} so'm`;
  }
  return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
};
