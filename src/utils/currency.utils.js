export const getActiveCurrency = () => {
  try {
    const prefix = 'kotyol_erp_';
    const savedRaw = localStorage.getItem(`${prefix}selected_currency`) || localStorage.getItem(`${prefix}company_currency`);
    if (savedRaw) {
      const parsed = JSON.parse(savedRaw);
      if (parsed) return String(parsed).toUpperCase();
    }

    const authState = localStorage.getItem('kotyol_erp_auth');
    if (authState) {
      const parsed = JSON.parse(authState);
      const user = parsed.state?.user || parsed.user;
      const currency = user?.currency || user?.organization_currency || user?.branch_currency;
      if (currency) return String(currency).toUpperCase();
    }
  } catch {}
  return 'UZS';
};

export const getCurrencySymbol = () => {
  const code = getActiveCurrency().toUpperCase();
  if (code === 'USD' || code === '$') {
    return '$';
  }
  return "so'm";
};

export const parseRawNumber = (val) => {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const clean = String(val).replace(/[\s\u00A0]/g, '').replace(/,/g, '.');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
};

export const formatCurrency = (amount) => {
  const num = parseRawNumber(amount);
  const code = getActiveCurrency().toUpperCase();

  if (code === 'USD' || code === '$') {
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }
  return `${num.toLocaleString('uz-UZ')} so'm`;
};
