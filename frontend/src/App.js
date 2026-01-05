// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import NavbarComponent from './components/NavbarComponent';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Products from './pages/Products';
import Contact from './pages/Contact';
import ProductDetails from './pages/ProductDetails';
import Credit from './pages/Credit';
import MyOrders from './pages/MyOrders';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';
import Wishlist from './pages/Wishlist';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import AdminDashboard from './pages/AdminDashboard';
import OrderConfirmation from './pages/OrderConfirmation';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState('/products');

  useEffect(() => {
    const checkAuth = () => {
      // This will trigger cart refresh in context
    };
    
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);

  // Function to trigger login from anywhere
  const requireLogin = (redirectPath = '/products') => {
    setRedirectAfterLogin(redirectPath);
    setShowLogin(true);
  };
  

  return (
    <CartProvider requireLogin={requireLogin}>
     
      <Router>
        
        <div className="d-flex flex-column min-vh-100">
          <NavbarComponent onLoginRequired={requireLogin} />
          <main className="flex-grow-1">
            <Routes>
              {/* Public Routes (no login required) */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/contact" element={<Contact />} />
                <Route 
                path="/admin" 
                element={
                  localStorage.getItem('token') ? 
                  <AdminDashboard /> : 
                  <Navigate to="/login" replace />
                } 
              />
              <Route 
    path="/order-confirmation" 
    element={
      localStorage.getItem('token') ? 
      <OrderConfirmation /> : 
      <Navigate to="/login" replace />
    } 
  />
            
              <Route path="/signup" element={<Signup />} />
              {/* Protected Routes */}
              <Route 
                path="/cart" 
                element={
                  localStorage.getItem('token') ? 
                  <Credit /> : 
                  <Navigate to="/products" replace />
                } 
              />
 <Route 
  path="/wishlist" 
  element={
    localStorage.getItem('token') ? 
    <Wishlist /> : 
    <Navigate to="/login" replace />
  } 
/>
              <Route 
                path="/myorders" 
                element={
                  localStorage.getItem('token') ? 
                  <MyOrders /> : 
                  <Navigate to="/products" replace />
                } 
              />
              <Route 
    path="/settings" 
    element={
      localStorage.getItem('token') ? 
      <Settings /> : 
      <Navigate to="/products" replace />
    } 
  />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
        
        {/* Login Modal */}
        <Login
          show={showLogin}
          onHide={() => setShowLogin(false)}
          redirectAfterLogin={redirectAfterLogin}
        />
      
      </Router>

    </CartProvider>
  );
}

export default App;