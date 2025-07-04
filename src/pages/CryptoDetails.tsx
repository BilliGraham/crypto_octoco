import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCryptos } from '../hooks/useCryptos';
import { useCurrencyConversion } from '../hooks/useCurrencyConversion';
import { formatZAR, formatZARMarketCap } from '../utils/formatters';
import styles from './CryptoDetails.module.css';

const CryptoDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cryptos, loading, error } = useCryptos({
    priceChange: true,
  });
  const { 
    convertUSDToZAR, 
    zarRate, 
    loading: ratesLoading, 
    error: ratesError 
  } = useCurrencyConversion();

  const isLoading = loading || ratesLoading;
  const hasError = error || ratesError;

  // Find the specific cryptocurrency
  const crypto = cryptos.find(c => c.id === id);

  if (!id || (!isLoading && !crypto)) {
    return (
      <div className={styles.errorContainer}>
        <h2>Cryptocurrency not found</h2>
        <button onClick={() => navigate('/')} className={styles.backButton}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (hasError) return <div className={styles.error}>{error || ratesError}</div>;

  // Convert all values to ZAR
  const zarPrice = convertUSDToZAR(crypto!.currentPrice);
  const zarMarketCap = convertUSDToZAR(crypto!.marketCap);
  const zar24hHigh = convertUSDToZAR(crypto!.high24h);
  const zar24hLow = convertUSDToZAR(crypto!.low24h);
  const zar24hChange = convertUSDToZAR(crypto!.priceChange24h);

  return (
    <div className={styles.container}>
      <button onClick={() => navigate('/')} className={styles.backButton}>
        &larr; Back to Dashboard
      </button>

      <div className={styles.header}>
        <div className={styles.coinHeader}>
          <img 
            src={crypto!.image} 
            alt={crypto!.name} 
            className={styles.coinImage}
          />
          <h1>{crypto!.name} ({crypto!.symbol.toUpperCase()})</h1>
        </div>
        <div className={styles.priceContainer}>
          <h2>{zarPrice !== null ? formatZAR(zarPrice) : '-'}</h2>
          <span className={zar24hChange && zar24hChange >= 0 ? styles.positive : styles.negative}>
            {zar24hChange !== null ? crypto!.priceChangePercentage24h : '-'}
          </span>
        </div>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailCard}>
          <h3>Market Cap</h3>
          <p>{zarMarketCap !== null ? formatZARMarketCap(zarMarketCap) : '-'}</p>
        </div>
        <div className={styles.detailCard}>
          <h3>24h Trading Volume</h3>
          <p>{crypto!.totalVolume ? formatZARMarketCap(crypto!.totalVolume * zarRate!) : '-'}</p>
        </div>
        <div className={styles.detailCard}>
          <h3>24h High</h3>
          <p>{zar24hHigh !== null ? formatZAR(zar24hHigh) : '-'}</p>
        </div>
        <div className={styles.detailCard}>
          <h3>24h Low</h3>
          <p>{zar24hLow !== null ? formatZAR(zar24hLow) : '-'}</p>
        </div>
        <div className={styles.detailCard}>
          <h3>Circulating Supply</h3>
          <p>{crypto!.circulatingSupply?.toLocaleString() || '-'} {crypto!.symbol.toUpperCase()}</p>
        </div>
        <div className={styles.detailCard}>
          <h3>All Time High</h3>
          <p>{crypto!.ath ? formatZAR(crypto!.ath * zarRate!) : '-'}</p>
        </div>
      </div>

      {crypto!.description && (
        <div className={styles.description}>
          <h3>About {crypto!.name}</h3>
          <p>{crypto!.description}</p>
        </div>
      )}
    </div>
  );
};

export default CryptoDetails;