import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiSearch, FiLogOut, FiUser, FiLayout } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [searchVal, setSearchVal] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchVal)}`);
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo">
          Electro<span>Store</span>
        </Link>

        <form className="nav-search" onSubmit={handleSearch}>
          <FiSearch size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </form>

        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Shop
          </Link>

          {isAdmin && (
            <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
              <FiLayout style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Dashboard
            </Link>
          )}

          {user && !isAdmin && (
            <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}>
              Orders
            </Link>
          )}

          <Link to="/cart" className="nav-link" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <FiShoppingCart size={20} />
            {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="nav-links" style={{ gap: '1rem', marginLeft: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FiUser /> {user.firstName}
              </span>
              <button onClick={logout} className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <FiLogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <div className="nav-links" style={{ gap: '1rem' }}>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
