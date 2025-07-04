import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CryptoDetails from './pages/CryptoDetails';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/crypto/:id" element={<CryptoDetails />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>Crypto prices in ZAR - Powered by CoinGecko API</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;