/**
 * Formats a ZAR amount with proper currency formatting
 */
export const formatZAR = (zarAmount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(zarAmount);
};

/**
 * Formats large numbers (like market caps) with ZAR symbol and 2 decimals
 */
export const formatZARMarketCap = (zarAmount: number): string => {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(zarAmount);
};

/**
 * Combined utility that converts USD to ZAR and formats it
 * Rounds to 2 decimal places before formatting
 */
export const formatUSDToZAR = (usdAmount: number, zarRate: number | null): string => {
    if (!zarRate) return 'Loading...';
    const zarAmount = Math.round(usdAmount * zarRate * 100) / 100;
    return formatZAR(zarAmount);
};