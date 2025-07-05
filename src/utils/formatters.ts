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

// Format large numbers (market cap, volume)
export const formatLargeNumber = (value: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Format supply numbers
export const formatSupply = (value: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    maximumFractionDigits: 0
  }).format(value);
};

// Format percentage changes
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

// Format date
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};


