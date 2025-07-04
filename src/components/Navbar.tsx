import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Crypto Tracker
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
