export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', locale: 'en-CA' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', locale: 'en-AU' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'SGD', symbol: 'SG$', name: 'Singapore Dollar', locale: 'en-SG' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', locale: 'ar-AE' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', locale: 'de-CH' }
];

export const formatCurrency = (amount, currencyCode = 'USD') => {
  const currency = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];
  const num = Number(amount) || 0;
  
  // Format to 2 decimal places with proper thousands separators
  const formatted = num.toLocaleString(currency.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return `${currency.symbol} ${formatted}`;
};
