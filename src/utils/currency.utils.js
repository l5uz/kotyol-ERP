export const getActiveCurrency = () => {
  try {
    const prefix = 'kotyol_erp_';
    
    // 1. Check direct company currency setting
    const companyCurr = localStorage.getItem(`${prefix}company_currency`) || localStorage.getItem('company_currency');
    if (companyCurr) {
      const clean = companyCurr.replace(/"/g, '').trim().toUpperCase();
      if (clean) return clean;
    }

    // 2. Check user profile
    const userProfile = localStorage.getItem('user_profile');
    if (userProfile) {
      const parsed = JSON.parse(userProfile);
      const curr = parsed?.currency || parsed?.organization_currency;
      if (curr) return String(curr).trim().toUpperCase();
    }

    // 3. Check selected currency fallback
    const savedRaw = localStorage.getItem(`${prefix}selected_currency`);
    if (savedRaw) {
      const parsed = JSON.parse(savedRaw);
      if (parsed) return String(parsed).trim().toUpperCase();
    }
  } catch (_err) {
    // Ignore storage parse errors
  }

  return 'UZS';
};

export const setActiveCurrency = (currencyCode) => {
  if (!currencyCode) return;
  const clean = String(currencyCode).trim().toUpperCase();
  const prefix = 'kotyol_erp_';
  localStorage.setItem(`${prefix}company_currency`, clean);
  localStorage.setItem('company_currency', clean);

  // Update user_profile if logged in
  try {
    const userProfile = localStorage.getItem('user_profile');
    if (userProfile) {
      const parsed = JSON.parse(userProfile);
      parsed.currency = clean;
      localStorage.setItem('user_profile', JSON.stringify(parsed));
    }
  } catch (_err) {
    // Ignore storage write errors
  }

  window.dispatchEvent(new CustomEvent('currency-changed', { detail: { currency: clean } }));
};

export const getCurrencySymbol = (customCurrency) => {
  const code = (customCurrency || getActiveCurrency()).toUpperCase();
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

export const formatCurrency = (amount, customCurrency) => {
  const num = parseRawNumber(amount);
  const code = (customCurrency || getActiveCurrency()).toUpperCase();

  if (code === 'USD' || code === '$') {
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${num.toLocaleString('uz-UZ')} so'm`;
};
