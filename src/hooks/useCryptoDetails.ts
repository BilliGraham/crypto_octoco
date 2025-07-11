import { useState } from 'react';
import {
  formatDate,
  formatZAR,
  formatLargeNumber,
  formatPercentage,
  formatSupply,
} from '../utils/formatters';

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  
  // Price data
  currentPrice: number;
  formattedPrice: string;
  priceChange24h: number;
  formattedPriceChange: string;
  priceChangePercentage24h: number;
  formattedPriceChangePercentage: string;
  
  // Market data
  marketCap: number;
  formattedMarketCap: string;
  totalVolume: number;
  formattedTotalVolume: string;
  marketCapRank: number;
  
  // 24h ranges
  high24h: number;
  formattedHigh24h: string;
  low24h: number;
  formattedLow24h: string;
  
  // Supply
  circulatingSupply: number;
  formattedCirculatingSupply: string;
  
  // All-time highs/lows
  ath: number;
  formattedATH: string;
  athDate: string;
  atl: number;
  formattedATL: string;
  atlDate: string;
  
  // Sentiment
  upVotesPercentage: number;
  formattedUpVotesPercentage: string;
  downVotesPercentage: number;
  formattedDownVotesPercentage: string;
  
  // Links
  homepage: string;
  blockchainSite: string;
  
  // Description
  description?: string;
  
  // Metadata
  lastUpdated: string;
}

interface UseCryptoDetailsOptions {
  currency?: string;
}

/**
 * Custom React hook to fetch and manage detailed information about a cryptocurrency from the CoinGecko API.
 *
 * @param options - Options for fetching crypto details.
 * @param options.currency - The currency code to use for price and market data (default: 'zar').
 * @returns An object containing:
 * - `crypto`: The fetched and formatted cryptocurrency data, or `null` if not loaded.
 * - `loading`: Boolean indicating if the data is currently being fetched.
 * - `error`: Error message if the fetch failed, or `null` if no error.
 * - `getCryptoById`: Async function to fetch details for a cryptocurrency by its CoinGecko ID.
 *
 * @example
 * ```tsx
 * const { crypto, loading, error, getCryptoById } = useCryptoDetails({ currency: 'usd' });
 * useEffect(() => {
 *   getCryptoById('bitcoin');
 * }, []);
 * ```
 */
export function useCryptoDetails({ currency = 'zar' }: UseCryptoDetailsOptions = {}) {
  const [crypto, setCrypto] = useState<CryptoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCryptoById = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const data = await response.json();
      const { market_data, image, links, description, sentiment_votes_up_percentage, sentiment_votes_down_percentage, last_updated } = data;
      const currentCurrencyData = market_data.current_price[currency];

      const formattedData: CryptoData = {
        id: data.id,
        symbol: data.symbol.toUpperCase(),
        name: data.name,
        image: image?.large ?? '',
        
        // Price data
        currentPrice: currentCurrencyData,
        formattedPrice: formatZAR(currentCurrencyData),
        priceChange24h: market_data.price_change_24h_in_currency[currency],
        formattedPriceChange: formatZAR(Math.abs(market_data.price_change_24h_in_currency[currency])),
        priceChangePercentage24h: market_data.price_change_percentage_24h_in_currency[currency],
        formattedPriceChangePercentage: formatPercentage(
          market_data.price_change_percentage_24h_in_currency[currency]
        ),
        
        // Market data
        marketCap: market_data.market_cap[currency],
        formattedMarketCap: formatLargeNumber(market_data.market_cap[currency]),
        totalVolume: market_data.total_volume[currency],
        formattedTotalVolume: formatLargeNumber(market_data.total_volume[currency]),
        marketCapRank: market_data.market_cap_rank,
        
        // 24h ranges
        high24h: market_data.high_24h[currency],
        formattedHigh24h: formatZAR(market_data.high_24h[currency]),
        low24h: market_data.low_24h[currency],
        formattedLow24h: formatZAR(market_data.low_24h[currency]),
        
        // Supply
        circulatingSupply: market_data.circulating_supply,
        formattedCirculatingSupply: formatSupply(market_data.circulating_supply),
        
        // All-time highs/lows
        ath: market_data.ath[currency],
        formattedATH: formatZAR(market_data.ath[currency]),
        athDate: formatDate(market_data.ath_date[currency]),
        atl: market_data.atl[currency],
        formattedATL: formatZAR(market_data.atl[currency]),
        atlDate: formatDate(market_data.atl_date[currency]),
        
        // Sentiment
        upVotesPercentage: sentiment_votes_up_percentage ?? 0,
        formattedUpVotesPercentage: formatPercentage(sentiment_votes_up_percentage ?? 0),
        downVotesPercentage: sentiment_votes_down_percentage ?? 0,
        formattedDownVotesPercentage: formatPercentage(sentiment_votes_down_percentage ?? 0),
        
        // Links
        homepage: links.homepage?.[0] ?? '',
        blockchainSite: links.blockchain_site?.[0] ?? '',
        
        // Description
        description: description?.en ?? '',
        
        // Metadata
        lastUpdated: last_updated,
      };

      setCrypto(formattedData);
    } catch (err: any) {
      setError(err.message ?? 'Failed to fetch cryptocurrency details');
      setCrypto(null);
    } finally {
      setLoading(false);
    }
  };

  return { crypto, loading, error, getCryptoById };
}