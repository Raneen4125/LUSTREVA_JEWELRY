// src/components/NavbarComponent.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { FaBars, FaTimes , FaShoppingCart} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { FaHeart } from 'react-icons/fa';
import '../styles/NavbarComponent.css';

const NavbarComponent = ({ onLoginRequired }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();
  const [wishlistCount, setWishlistCount] = useState(0);
  const token = localStorage.getItem('token');
   const getUserRole = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.role;
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
    return null;
  };

  const userRole = getUserRole();
useEffect(() => {
  const fetchCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWishlistCount(data.length);
      }
    } catch (err) {}
  };
  fetchCount();
}, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const handleCartClick = () => {
    closeMobileMenu();
    if (!token) {
      onLoginRequired('/cart');
      return;
    }
    navigate('/cart');
  };

  const handleLogout = () => {
    closeMobileMenu();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const handleNavClick = (path) => {
    closeMobileMenu();
    navigate(path);
  };

  // Handle login click - trigger modal instead of navigation
  const handleLoginClick = () => {
    closeMobileMenu();
    onLoginRequired('/products'); // Open login modal
  };

  return (
    <header className="elegant-header">
      <Container>
        <div className="brand-row">
  <button 
    className="mobile-menu-toggle"
    onClick={toggleMobileMenu}
    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
  >
    {isMobileMenuOpen ? <FaTimes size={24} color="#fff" /> : <FaBars size={24} color="#fff" />}
  </button>
  <Link to="/" className="brand-text" onClick={closeMobileMenu}>
    Lustreva
  </Link>
    <div className="navbar-right">
  <button
    className="cart-icon-button"
    onClick={handleCartClick}
    aria-label={`Cart with ${cart.length} items`}
  >
    🛒
    {cart.length > 0 && (
      <span className="cart-badge">{cart.length}</span>
    )}
  </button>
   <button
    className="wishlist-icon-button"
    onClick={() => navigate('/wishlist')}
    aria-label="Wishlist"
  >
    <FaHeart size={18} color="#f4e6e8" />
    {wishlistCount > 0 && (
      <span className="cart-badge">{wishlistCount}</span>
    )}
  </button>
  </div>
</div>
        {/* Desktop Navigation */}
        <div className="navbar-content d-flex justify-content-between align-items-center">
          <Nav className="nav-row desktop-nav">
            <Nav.Link
              as={Link}
              to="/"
              onClick={closeMobileMenu}
              className={`nav-link-custom ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/about"
              onClick={closeMobileMenu}
              className={`nav-link-custom ${location.pathname === '/about' ? 'active' : ''}`}
            >
              About
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/services"
              onClick={closeMobileMenu}
              className={`nav-link-custom ${location.pathname === '/services' ? 'active' : ''}`}
            >
              Services
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/products"
              onClick={closeMobileMenu}
              className={`nav-link-custom ${location.pathname === '/products' ? 'active' : ''}`}
            >
              Collection
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/contact"
              onClick={closeMobileMenu}
              className={`nav-link-custom ${location.pathname === '/contact' ? 'active' : ''}`}
            >
              Contact
            </Nav.Link>
            
            {/* Authenticated user */}
            {token ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/myorders"
                  onClick={closeMobileMenu}
                  className={`nav-link-custom ${location.pathname === '/myorders' ? 'active' : ''}`}
                >
                  MyOrders
                </Nav.Link>
                 <Nav.Link
      as={Link}
      to="/settings"
      onClick={closeMobileMenu}
      className={`nav-link-custom ${location.pathname === '/settings' ? 'active' : ''}`}
    >
      Settings
    </Nav.Link>
        <Nav.Link as={Link} to="/wishlist">Wishlist</Nav.Link>
    {userRole === 'admin' && (
                  <Nav.Link
                    as={Link}
                    to="/admin"
                    onClick={closeMobileMenu}
                    className={`nav-link-custom ${location.pathname === '/admin' ? 'active' : ''}`}
                  >
                    Admin
                  </Nav.Link>
                   )}
                <Nav.Link
                  onClick={handleLogout}
                  className="nav-link-custom"
                  style={{ cursor: 'pointer' }}
                >
                  Logout
                </Nav.Link>
              </>
            ) : (
              /* Guest user - trigger modal instead of navigation */
              <Nav.Link
                onClick={handleLoginClick}
                className="nav-link-custom"
                style={{ cursor: 'pointer' }}
              >
                Login
              </Nav.Link>
              
            )}
          </Nav>
           <div className="navbar-right"></div>
        
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="mobile-nav-overlay">
            <div className="mobile-nav-menu">
               <Link
      to="/settings"
      onClick={() => handleNavClick('/settings')}
      className={`mobile-nav-link ${location.pathname === '/settings' ? 'active' : ''}`}
    >
      ⚙️ Settings
    </Link>
              <Link
                to="/"
                onClick={() => handleNavClick('/')}
                className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
               ✨ Home
              </Link>
              
              <Link
                to="/about"
                onClick={() => handleNavClick('/about')}
                className={`mobile-nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              >
               👤About
              </Link>
              <Link
                to="/services"
                onClick={() => handleNavClick('/services')}
                className={`mobile-nav-link ${location.pathname === '/services' ? 'active' : ''}`}
              >
               🛠️Services
              </Link>
              <Link
                to="/products"
                onClick={() => handleNavClick('/products')}
                className={`mobile-nav-link ${location.pathname === '/products' ? 'active' : ''}`}
              >
                💍Collection
              </Link>
              <Link
                to="/contact"
                onClick={() => handleNavClick('/contact')}
                className={`mobile-nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
              >
               ✉️ Contact
              </Link>
               {userRole === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => handleNavClick('/admin')}
                      className={`mobile-nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                    >
                      👑 Admin
                    </Link>
                  )}
              
              {/* Authenticated user */}
              {token ? (
                <>
                  <Link
                    to="/myorders"
                    onClick={() => handleNavClick('/myorders')}
                    className={`mobile-nav-link ${location.pathname === '/myorders' ? 'active' : ''}`}
                  >
                   📦MyOrders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mobile-logout-btn"
                  >
                    🔓Logout
                  </button>
                </>
              ) : (
                /* Guest user - trigger modal instead of navigation */
                <button
                  onClick={handleLoginClick}
                  className="mobile-nav-link"
                  style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                >
                  🔐Login
                </button>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};

export default NavbarComponent;



