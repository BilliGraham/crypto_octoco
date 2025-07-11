import { useEffect, useState } from 'react';

const API_KEY = 'e10e6584df624684a8013fd84f9ae6c7';
const BASE_URL = `https://openexchangerates.org/api/latest.json?app_id=${API_KEY}`;

interface ExchangeRatesResponse {
  disclaimer: string;
  license: string;
  timestamp: number;
  base: string;
  rates: Record<string, number>;
}

export function useCurrencyConversion() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [zarRate, setZarRate] = useState<number | null>(null);



  useEffect(() => {
    /**
     * Fetches the latest currency exchange rates from the API and updates local state.
     *
     * - Sets loading state to `true` while fetching.
     * - Clears any previous error state.
     * - On success:
     *   - Updates the rates state with the fetched exchange rates.
     *   - Stores the ZAR (South African Rand) rate separately for quick access if available.
     * - On failure:
     *   - Logs the error to the console.
     *   - Updates the error state with the error message.
     * - Always sets loading state to `false` after completion.
     *
     * @async
     * @throws {Error} If the fetch request fails or the response is not OK.
     */
    async function fetchRates() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch exchange rates: ${response.status}`);
        }

        const data: ExchangeRatesResponse = await response.json();
        setRates(data.rates);
        
        // Specifically store ZAR rate for quick access
        if (data.rates['ZAR']) {
          setZarRate(data.rates['ZAR']);
        }
      } catch (err: any) {
        console.error('Exchange rate fetch error:', err);
        setError(err.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchRates();
  }, []);

  /**
   * Converts a given amount in USD to ZAR using the current exchange rate.
   *
   * @param usdAmount - The amount in US Dollars to convert.
   * @returns The equivalent amount in South African Rand (ZAR), or `null` if the exchange rate is unavailable.
   */
  const convertUSDToZAR = (usdAmount: number): number | null => {
    if (!zarRate) return null;
    console.log({ zarRate, usdAmount});
    return usdAmount * zarRate;
  };

  return {
    convertUSDToZAR,
    zarRate,
    rates,
    loading,
    error,
  };
}