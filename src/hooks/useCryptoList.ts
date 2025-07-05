import { useState, useEffect, useCallback } from 'react';
import { formatPercentage, formatLargeNumber, formatSupply, formatZAR, formatDate } from '../utils/formatters';

export interface CryptoListData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  formattedPrice: string;
  lastUpdated: string;
  marketCap: number;
  formattedMarketCap: string;
  rank: number;
  priceChange24h: number;
  formattedPriceChange: string;
  priceChangePercentage24h: number;
  formattedPriceChangePercentage: string;
  high24h: number;
  formattedHigh24h: string;
  low24h: number;
  formattedLow24h: string;
  totalVolume: number;
  formattedTotalVolume: string;
  circulatingSupply: number;
  formattedCirculatingSupply: string;
  ath: number;
  formattedATH: string;
  athDate: string;
  description?: string;
}

interface UseCryptoListsOptions {
  currency?: string;
  limit?: number;
  priceChange?: boolean;
  detailed?: boolean;
}

export function useCryptoLists({ 
  currency = 'zar', 
  limit = 10, 
  priceChange = false,
  detailed = false
}: UseCryptoListsOptions = {}) {
  const [cryptos, setCryptos] = useState<CryptoListData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchCryptos = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const marketUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`;
      const marketResponse = await fetch(marketUrl, { signal });

      if (!marketResponse.ok) {
        throw new Error(`Failed to fetch crypto market data: ${marketResponse.status}`);
      }

      const marketData = await marketResponse.json();
      const now = new Date().toISOString();

      let detailedData: any[] = [];
      if (detailed) {
        detailedData = await Promise.all(
          marketData.map(async (coin: any) => {
            const detailResponse = await fetch(
              `https://api.coingecko.com/api/v3/coins/${coin.id}`,
              { signal }
            );
            return detailResponse.ok ? await detailResponse.json() : null;
          })
        );
      }

      const formatted = marketData.map((item: any, index: number) => {
        const detail = detailed ? detailedData[index] : null;
        
        return {
          id: item.id,
          symbol: item.symbol.toUpperCase(),
          name: item.name,
          image: item.image,
          currentPrice: item.current_price,
          formattedPrice: formatZAR(item.current_price),
          lastUpdated: item.last_updated,
          marketCap: item.market_cap,
          formattedMarketCap: formatLargeNumber(item.market_cap),
          rank: item.market_cap_rank,
          priceChange24h: item.price_change_24h,
          formattedPriceChange: formatZAR(Math.abs(item.price_change_24h)),
          priceChangePercentage24h: item.price_change_percentage_24h,
          formattedPriceChangePercentage: formatPercentage(item.price_change_percentage_24h),
          high24h: item.high_24h,
          formattedHigh24h: formatZAR(item.high_24h),
          low24h: item.low_24h,
          formattedLow24h: formatZAR(item.low_24h),
          totalVolume: item.total_volume,
          formattedTotalVolume: formatLargeNumber(item.total_volume),
          circulatingSupply: item.circulating_supply,
          formattedCirculatingSupply: formatSupply(item.circulating_supply),
          ath: item.ath,
          formattedATH: formatZAR(item.ath),
          athDate: formatDate(item.ath_date),
          description: detail?.description?.en
        };
      });

      setCryptos(formatted);
      setLastUpdated(now);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to fetch cryptocurrency data');
      }
    } finally {
      setLoading(false);
    }
  }, [currency, limit, detailed, priceChange]); // All dependencies declared

  useEffect(() => {
    const controller = new AbortController();
    fetchCryptos(controller.signal);
    return () => controller.abort();
  }, [fetchCryptos]); // Only depends on fetchCryptos now

  const refresh = useCallback(() => {
    const controller = new AbortController();
    fetchCryptos(controller.signal);
    return () => controller.abort();
  }, [fetchCryptos]);

  return { 
    cryptos, 
    loading, 
    error, 
    lastUpdated,
    refresh
  };
}