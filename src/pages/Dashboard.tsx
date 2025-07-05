import { useCryptoLists } from '../hooks/useCryptoList';
import { formatZAR } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const { cryptos, loading, error, lastUpdated } = useCryptoLists({
    priceChange: true,
  });

  const isLoading = loading;
  const hasError = error;
  const navigate = useNavigate();

  return (
    <div className={styles.dashboard}>
      <h1>Top 10 Cryptocurrencies</h1>
      
      {lastUpdated && (
        <p className={styles.lastUpdated}>
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </p>
      )}

      {isLoading && <p>Loading cryptocurrency data...</p>}
      {hasError && <p className={styles.error}>{error}</p>}

      {!isLoading && !hasError && (
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
            {cryptos.map((coin) => (
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
                <td>{formatZAR(coin.currentPrice)}</td>
                <td className={coin.priceChange24h >= 0 ? styles.positive : styles.negative}>
                  {formatZAR(coin.priceChange24h)}
                </td>
                <td>{formatZAR(coin.marketCap)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;