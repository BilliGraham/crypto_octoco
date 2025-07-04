import { useCryptos } from '../hooks/useCryptos';
import { useCurrencyConversion } from '../hooks/useCurrencyConversion';
import { formatZAR, formatZARMarketCap } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css'; 

const Dashboard: React.FC = () => {
  const { cryptos, loading, error, lastUpdated } = useCryptos({
    priceChange: true,
  });
  
  const { 
    convertUSDToZAR, 
    zarRate, 
    loading: ratesLoading, 
    error: ratesError 
  } = useCurrencyConversion();

  // Combine loading states
  const isLoading = loading || ratesLoading;
  const hasError = error || ratesError;
  const navigate = useNavigate();

  return (
    <div className={styles.dashboard}>
      <h1>Top 10 Cryptocurrencies</h1>
      {lastUpdated && (
        <p className={styles.lastUpdated}>
          Last updated: {new Date(lastUpdated).toLocaleString()}
          {zarRate && ` | Exchange rate: 1 USD = ${formatZAR(zarRate)}`}
        </p>
      )}

      {isLoading && <p>Loading cryptocurrency data...</p>}
      {hasError && (
        <p className={styles.error}>
          {error || ratesError}
        </p>
      )}

      {!isLoading && !hasError && zarRate && (
        <table className={styles.cryptoTable}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Logo</th>
              <th>Name</th>
              <th>Price (ZAR)</th>
              <th>24h Change</th>
              <th>Market Cap (ZAR)</th>
            </tr>
          </thead>
          <tbody>
            {cryptos.map((coin) => {
                const zarPrice = convertUSDToZAR(coin.currentPrice);
                const zar24hChange = convertUSDToZAR(coin.priceChange24h);
                const zarMarketCap = convertUSDToZAR(coin.marketCap * zarRate);
              
                return (
                    <tr 
                    key={coin.id} 
                    onClick={() => navigate(`/crypto/${coin.id}`)} 
                    className={styles.clickableRow}
                    >
                    <td>{coin.rank}</td>
                    <td>
                    <img 
                        src={coin.image} 
                        alt={coin.name} 
                        className={styles.coinImage}
                        loading="lazy"
                    />
                    </td>
                    <td>
                    {coin.name} ({coin.symbol.toUpperCase()})
                    </td>
                    <td>{zarPrice !== null ? formatZAR(zarPrice) : '-'}</td>
                    <td className={(zar24hChange ?? 0) >= 0 ? styles.positive : styles.negative}>
                    {zar24hChange !== null ? formatZAR(zar24hChange) : '-'}
                    </td>
                    <td>{zarMarketCap !== null ? formatZARMarketCap(zarMarketCap) : '-'}</td>
                    </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;