import { useState, useEffect } from 'react';

export interface CryptoData {
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

interface UseCryptosOptions {
  currency?: string;
  limit?: number;
  priceChange?: boolean;
  detailed?: boolean; // New option to fetch detailed data
}

export function useCryptos({ 
  currency = 'zar', 
  limit = 10, 
  priceChange = false,
  detailed = false
}: UseCryptosOptions = {}) {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Format numbers to ZAR currency
  const formatToZAR = (value: number): string => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Format large numbers (market cap, volume)
  const formatLargeNumber = (value: number): string => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format supply numbers
  const formatSupply = (value: number): string => {
    return new Intl.NumberFormat('en-ZA', {
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format percentage changes
  const formatPercentage = (value: number): string => {
    return value > 0 
      ? `+${value.toFixed(2)}%` 
      : `${value.toFixed(2)}%`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCryptos() {
      setLoading(true);
      setError(null);

      try {
        // First fetch basic market data
        const marketUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`;
        const marketResponse = await fetch(marketUrl, { signal: controller.signal });

        if (!marketResponse.ok) {
          throw new Error(`Failed to fetch crypto market data: ${marketResponse.status}`);
        }

        const marketData = await marketResponse.json();
        const now = new Date().toISOString();

        // If detailed info is needed, fetch additional data for each coin
        let detailedData: any[] = [];
        if (detailed) {
          detailedData = await Promise.all(
            marketData.map(async (coin: any) => {
              const detailResponse = await fetch(
                `https://api.coingecko.com/api/v3/coins/${coin.id}`,
                { signal: controller.signal }
              );
              return detailResponse.ok ? await detailResponse.json() : null;
            })
          );
        }

        const formatted: CryptoData[] = marketData.map((item: any, index: number) => {
          const detail = detailed ? detailedData[index] : null;
          
          return {
            id: item.id,
            symbol: item.symbol.toUpperCase(),
            name: item.name,
            image: item.image,
            currentPrice: item.current_price,
            formattedPrice: formatToZAR(item.current_price),
            lastUpdated: item.last_updated,
            marketCap: item.market_cap,
            formattedMarketCap: formatLargeNumber(item.market_cap),
            rank: item.market_cap_rank,
            priceChange24h: item.price_change_24h,
            formattedPriceChange: formatToZAR(Math.abs(item.price_change_24h)),
            priceChangePercentage24h: item.price_change_percentage_24h,
            formattedPriceChangePercentage: formatPercentage(item.price_change_percentage_24h),
            high24h: item.high_24h,
            formattedHigh24h: formatToZAR(item.high_24h),
            low24h: item.low_24h,
            formattedLow24h: formatToZAR(item.low_24h),
            totalVolume: item.total_volume,
            formattedTotalVolume: formatLargeNumber(item.total_volume),
            circulatingSupply: item.circulating_supply,
            formattedCirculatingSupply: formatSupply(item.circulating_supply),
            ath: item.ath,
            formattedATH: formatToZAR(item.ath),
            athDate: formatDate(item.ath_date),
            description: detail?.description?.en
          };
        });

        setCryptos(formatted);
        setLastUpdated(now);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unknown error');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchCryptos();

    return () => controller.abort();
  }, [currency, limit, priceChange, detailed]);

  // Function to get single crypto details
  const getCryptoById = async (id: string): Promise<CryptoData | null> => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      const marketData = data.market_data;
      
      return {
        id: data.id,
        symbol: data.symbol.toUpperCase(),
        name: data.name,
        image: data.image?.large || data.image?.small || data.image?.thumb,
        currentPrice: marketData.current_price[currency],
        formattedPrice: formatToZAR(marketData.current_price[currency]),
        lastUpdated: data.last_updated,
        marketCap: marketData.market_cap[currency],
        formattedMarketCap: formatLargeNumber(marketData.market_cap[currency]),
        rank: marketData.market_cap_rank,
        priceChange24h: marketData.price_change_24h,
        formattedPriceChange: formatToZAR(Math.abs(marketData.price_change_24h)),
        priceChangePercentage24h: marketData.price_change_percentage_24h,
        formattedPriceChangePercentage: formatPercentage(marketData.price_change_percentage_24h),
        high24h: marketData.high_24h[currency],
        formattedHigh24h: formatToZAR(marketData.high_24h[currency]),
        low24h: marketData.low_24h[currency],
        formattedLow24h: formatToZAR(marketData.low_24h[currency]),
        totalVolume: marketData.total_volume[currency],
        formattedTotalVolume: formatLargeNumber(marketData.total_volume[currency]),
        circulatingSupply: marketData.circulating_supply,
        formattedCirculatingSupply: formatSupply(marketData.circulating_supply),
        ath: marketData.ath[currency],
        formattedATH: formatToZAR(marketData.ath[currency]),
        athDate: formatDate(marketData.ath_date[currency]),
        description: data.description?.en
      };
    } catch (err) {
      console.error('Error fetching crypto details:', err);
      return null;
    }
  };

  return { 
    cryptos, 
    loading, 
    error, 
    lastUpdated,
    getCryptoById,
    refresh: () => {
      setLoading(true);
      setError(null);
      setCryptos([]);
    }
  };
}