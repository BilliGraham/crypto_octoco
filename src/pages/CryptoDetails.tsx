import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCryptoDetails } from '../hooks/useCryptoDetails';
import styles from './CryptoDetails.module.css';

const CryptoDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { crypto, loading, error, getCryptoById } = useCryptoDetails();

  useEffect(() => {
    if (id) {
      getCryptoById(id);
    }
  }, [id]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  
  if (!crypto) {
    return (
      <div className={styles.errorContainer}>
        <h2>Cryptocurrency not found</h2>
        <button onClick={() => navigate('/')} className={styles.backButton}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => navigate('/')} className={styles.backButton}>
        &larr; Back to Dashboard
      </button>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.coinHeader}>
          <a href={crypto.blockchainSite} target="_blank" rel="noreferrer">
            <img src={crypto.image} alt={crypto.name} className={styles.coinImage} />
          </a>
          <h1>
            <a href={crypto.homepage} target="_blank" rel="noreferrer" className={styles.homepageLink}>
              {crypto.name}
            </a>{' '}
            <a href={crypto.blockchainSite} target="_blank" rel="noreferrer" className={styles.homepageLink}>
              ({crypto.symbol})
            </a>
          </h1>
        </div>
        <div className={styles.priceContainer}>
          <h2>{crypto.formattedPrice}</h2>
          <span className={crypto.priceChangePercentage24h >= 0 ? styles.positive : styles.negative}>
            {crypto.formattedPriceChangePercentage}
          </span>
        </div>
      </div>

      {/* Grid Sections */}
      <div className={styles.detailsGrid}>
        {/* Market Data */}
        <div className={styles.detailCard}>
          <h3>Market Cap</h3>
          <p>{crypto.formattedMarketCap}</p>
        </div>
        <div className={styles.detailCard}>
          <h3>24h Volume</h3>
          <p>{crypto.formattedTotalVolume}</p>
        </div>
        <div className={styles.detailCard}>
          <h3>24h High / Low</h3>
          <p>
            {crypto.formattedHigh24h} / {crypto.formattedLow24h}
          </p>
        </div>

        {/* Supply */}
        <div className={styles.detailCard}>
          <h3>Circulating Supply</h3>
          <p>{crypto.formattedCirculatingSupply} {crypto.symbol}</p>
        </div>

        {/* ATH / ATL */}
        <div className={styles.detailCard}>
          <h3>All-Time High</h3>
          <p>
            {crypto.formattedATH}
            <br />
            <small>on {crypto.athDate}</small>
          </p>
        </div>
        <div className={styles.detailCard}>
          <h3>All-Time Low</h3>
          <p>
            {crypto.formattedATL}
            <br />
            <small>on {crypto.atlDate}</small>
          </p>
        </div>

        {/* Empty div for spacing */}
        <div></div>

        {/* Sentiment */}
        <div className={styles.detailCard}>
          <h3>Sentiment</h3>
          <p>
            Positive - {crypto.formattedUpVotesPercentage}<br />
            Negative - {crypto.formattedDownVotesPercentage}
          </p>
        </div>
      </div>

      {/* Description */}
      {crypto.description && (
        <div className={styles.description}>
          <h3>About {crypto.name}</h3>
          <p>{crypto.description}</p>
        </div>
      )}
    </div>
  );
};

export default CryptoDetails;