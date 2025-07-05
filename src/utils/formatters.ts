/**
 * Formats a ZAR amount with proper currency formatting
 * @param zarAmount - The amount to format
 * @returns Formatted currency string (e.g., "R 1,234.56")
 */
export const formatZAR = (zarAmount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(zarAmount);
};

/**
 * Formats large numbers (market cap, volume) without decimal places
 * @param value - The numeric value to format
 * @returns Formatted currency string without decimals (e.g., "R 1,234")
 */
export const formatLargeNumber = (value: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Formats supply numbers without currency symbol
 * @param value - The numeric value to format
 * @returns Formatted number string (e.g., "1,234,567")
 */
export const formatSupply = (value: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Formats percentage changes with 2 decimal places
 * @param value - The percentage value to format
 * @returns Formatted percentage string (e.g., "5.25%")
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

/**
 * Formats a date string to localized date format
 * @param dateString - The date string to format
 * @returns Formatted date string (e.g., "2023-05-15")
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};