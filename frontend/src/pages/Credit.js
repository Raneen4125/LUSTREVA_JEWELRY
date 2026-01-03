import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import { useLocation } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import '../styles/Credit.css';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const Credit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const location =useLocation();
  
  const { cart, clearCart, removeFromCart ,updateQuantity } = useCart();
  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('token');

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const token = getToken();
    if (!token) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }
    
    // Navigate to order confirmation with cart data
    navigate('/order-confirmation', { 
      state: { cart: cart }
    });
  };

  // Auto-hide success alert
  useEffect(() => {
  if (location.state?.orderPlaced) {
    clearCart();                 
    setShowSuccessAlert(true);  
    navigate('/cart', { replace: true });
  }
}, [location.state, clearCart, navigate]);

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  return (
    <Container className="py-5 credit-container">
      <h2 className="credit-heading text-center mb-5">Your Shopping Cart</h2>

      {showSuccessAlert && (
        <Alert variant="success" className="credit-alert-success text-center mb-5">
          <Alert.Heading>🎉 Order Placed Successfully!</Alert.Heading>
          <p>Thank you for your purchase! View your order below.</p>
        </Alert>
      )}

      {cart.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted fs-5 credit-empty-text">Your cart is empty.</p>
          <Button
            onClick={() => navigate('/products')}
            className="btn-elegant rounded-pill px-5 py-2"
            variant="light"
          >
            Browse Collection
          </Button>
        </div>
      ) : (
        <>
          <Row className="g-4">
            {cart.map((item, index) => (
              <Col md={12} key={index}>
                <div className="credit-cart-item">
                  <div className="credit-item-image">
                    {item.image_data ? (
                         <img 
      src={`data:image/jpeg;base64,${item.image_data}`}
      alt={item.name || 'Jewelry'}
      style={{
        width: '80px',
        height: '80px',
        objectFit: 'cover',
        borderRadius: '8px'
      }}
      onError={(e) => {
        e.target.src = 'https://placehold.co/80x80?text=Product';
      }}
    />
  ) : (
    <div style={{ 
      width: '80px', height: '80px', background: '#eee', 
      borderRadius: '8px', display: 'flex', alignItems: 'center', 
      justifyContent: 'center', fontSize: '10px' 
    }}>
      No Image
    </div>
  )}
</div>
                  <div className="credit-item-info">
                    <h6 className="credit-item-title">{item.name}</h6>
                    <p className="credit-item-desc text-muted">
          Qty: {item.quantity || 1} × ${Number(item.price).toFixed(2)}
        </p>
        <div className="d-flex align-items-center mt-2">
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => updateQuantity(index, (item.quantity || 1) - 1)}
              disabled={(item.quantity || 1) <= 1}
              className="btn-remove rounded-circle"
              style={{ width: '32px', height: '32px', padding: 0 }}
            >
              –
            </Button>
            <span className="mx-2" style={{ minWidth: '30px', textAlign: 'center', fontWeight: '500' }}>
              {item.quantity || 1}
            </span>

            <Button
              size="sm"
              variant="outline-secondary"
              className="btn-remove rounded-circle"
              onClick={() => updateQuantity(index, (item.quantity || 1) + 1)}
              style={{ width: '32px', height: '32px', padding: 0 }}
            >
              +
            </Button>
          </div>
        {/* This calculates the price for the specific quantity of this item */}
        <strong className="credit-item-price">
          Subtotal: ${(Number(item.price) * (item.quantity || 1)).toFixed(2)}
        </strong>
      </div>


                  <Button
                    size="sm"
                    className="btn-remove rounded-circle"
                    onClick={() => removeFromCart(index)}
                    variant="outline-secondary"
                
                  >
                    ✕
                  </Button>
                </div>
              </Col>
            ))}
          </Row>

          <div className="credit-summary mt-5">
            <div className="credit-total">
              <h4 className="mb-0">
                Total: <span className="credit-gold">${total.toFixed(2)}</span>
              </h4>
            </div>
            <div className="credit-actions d-flex gap-3 flex-wrap">
              <Button
                onClick={handleCheckout}
                variant="light"
                className="btn-elegant rounded-pill px-4 py-2"
              >
                Confirm Order
              </Button>
              <Button
                onClick={handleClearCart}
                variant="light"
                className="btn-elegant rounded-pill px-4 py-2"
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="danger" className="mt-3 text-center">
              {error}
            </Alert>
          )}

          <div className="text-center mt-5">
            <Button
              onClick={() => navigate('/products')}
              variant="light"
              className="btn-elegant rounded-pill px-5 py-2"
            >
              ← Continue Shopping
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default Credit;