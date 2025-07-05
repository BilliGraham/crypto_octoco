import { useState } from 'react';
import { formatDate, formatZAR, formatLargeNumber, formatPercentage, formatSupply } from '../utils/formatters';

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

export function useCryptoDetails({ currency = 'zar' }: UseCryptoDetailsOptions = {}) {
  const [crypto, setCrypto] = useState<CryptoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCryptoById = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();
      const market = data.market_data;
      const currentPrice = market.current_price[currency];
      const priceChange24h = market.price_change_24h_in_currency[currency];
      const priceChangePercentage24h = market.price_change_percentage_24h_in_currency[currency];

      const formattedData: CryptoData = {
        id: data.id,
        symbol: data.symbol.toUpperCase(),
        name: data.name,
        image: data.image?.large ?? '',
        
        // Price data
        currentPrice: currentPrice,
        formattedPrice: formatZAR(currentPrice),
        priceChange24h: priceChange24h,
        formattedPriceChange: formatZAR(Math.abs(priceChange24h)),
        priceChangePercentage24h: priceChangePercentage24h,
        formattedPriceChangePercentage: formatPercentage(priceChangePercentage24h),
        
        // Market data
        marketCap: market.market_cap[currency],
        formattedMarketCap: formatLargeNumber(market.market_cap[currency]),
        totalVolume: market.total_volume[currency],
        formattedTotalVolume: formatLargeNumber(market.total_volume[currency]),
        marketCapRank: market.market_cap_rank,
        
        // 24h ranges
        high24h: market.high_24h[currency],
        formattedHigh24h: formatZAR(market.high_24h[currency]),
        low24h: market.low_24h[currency],
        formattedLow24h: formatZAR(market.low_24h[currency]),
        
        // Supply
        circulatingSupply: market.circulating_supply,
        formattedCirculatingSupply: formatSupply(market.circulating_supply),
        
        // All-time highs/lows
        ath: market.ath[currency],
        formattedATH: formatZAR(market.ath[currency]),
        athDate: formatDate(market.ath_date[currency]),
        atl: market.atl[currency],
        formattedATL: formatZAR(market.atl[currency]),
        atlDate: formatDate(market.atl_date[currency]),
        
        // Sentiment
        upVotesPercentage: data.sentiment_votes_up_percentage ?? 0,
        formattedUpVotesPercentage: formatPercentage(data.sentiment_votes_up_percentage ?? 0),
        downVotesPercentage: data.sentiment_votes_down_percentage ?? 0,
        formattedDownVotesPercentage: formatPercentage(data.sentiment_votes_down_percentage ?? 0),
        
        // Links
        homepage: data.links.homepage?.[0] ?? '',
        blockchainSite: data.links.blockchain_site?.[0] ?? '',
        
        // Description
        description: data.description?.en ?? '',
        
        // Metadata
        lastUpdated: data.last_updated,
      };

      setCrypto(formattedData);
    } catch (err: any) {
      setError(err.message ?? 'Failed to fetch crypto details');
      setCrypto(null);
    } finally {
      setLoading(false);
    }
  };

  return { crypto, loading, error, getCryptoById };
}