import { DEFAULT_CURRENCY_CODE } from '@/shared/currencies';
import { storageService } from '@/services/storage.service';

export const parseRawNumber = (val) => {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const clean = String(val).replace(/[\s\u00A0]/g, '').replace(/,/g, '.');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
};

export const formatCurrency = (amount, currencyCode) => {
  const num = parseRawNumber(amount);
  const code = currencyCode || storageService.get('selected_currency') || DEFAULT_CURRENCY_CODE;

  if (code === 'UZS' || code === "so'm") {
    return `${num.toLocaleString('uz-UZ')} so'm`;
  }
  return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
};
