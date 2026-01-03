import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import '../styles/PageLayout.css';

const CartPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const { cart, clearCart, removeFromCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) return alert('Your cart is empty!');
    setShowModal(true);
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return setEmailError('Email is required.');
    if (!emailRegex.test(email)) return setEmailError('Please enter a valid email.');
    
    setIsConfirmed(true);
    setEmailError('');
    setTimeout(() => {
      clearCart();
      setShowModal(false);
      setIsConfirmed(false);
      setEmail('');
      setShowSuccessAlert(true);
    }, 2000);
  };

  useEffect(() => {
    let timer;
    if (showSuccessAlert) {
      timer = setTimeout(() => setShowSuccessAlert(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [showSuccessAlert]);

  const handleClearCart = () => {
    if (window.confirm('Clear your cart?')) clearCart();
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Your Cart</h2>

      {showSuccessAlert && (
        <Alert variant="success" className="text-center">Order completed! Thank you!</Alert>
      )}

      {cart.length === 0 ? (
        <div className="text-center py-5">
          <p>Your cart is empty.</p>
          <Button
            variant="outline-dark"
            onClick={() => navigate('/products')}
            className="mt-2"
            style={{
                backgroundColor: '#6b4e3d',
                color: '#f8f3eb',
                fontWeight: '600',
                padding: '0.8rem 2rem',
                borderRadius: '30px',
                border: 'none',
                marginTop: '1.2rem',
                fontSize: '1.1rem',
                boxShadow: '0 4px 10px rgba(107, 78, 61, 0.2)',
              }}
          >
            Browse Jewelry
          </Button>
        </div>
      ) : (
        <>
          <Row>
            {cart.map((item, index) => (
              <Col md={12} key={index} className="mb-3">
                <div className="d-flex align-items-center p-3 border rounded">
                  <div style={{ width: '80px', height: '80px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={item.image} alt={item.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                  <div className="ms-3 flex-grow-1">
                    <h6>{item.name}</h6>
                    <strong>${item.price}</strong>
                  </div>
                  <Button variant="outline-danger" size="sm" onClick={() => removeFromCart(index)}>Remove</Button>
                </div>
              </Col>
            ))}
          </Row>

          <div className="bg-light p-4 rounded mt-4 d-flex flex-wrap justify-content-between align-items-center">
            <h4>Total: ${total}</h4>
            <div>
              <Button
                onClick={handleCheckout}
                className="me-2"
                style={{ backgroundColor: '#d4af37', borderColor: '#d4af37', color: '#000', fontWeight: '600' }}
              >
                Checkout
              </Button>
              <Button
                variant="outline-secondary"
                onClick={handleClearCart}
                className="me-2"
                style={{ backgroundColor: '#d4af37', borderColor: '#d4af37', color: '#000', fontWeight: '600' }}
              >
                Clear Cart
              </Button>
              <Button
                variant="outline-dark"
                onClick={() => navigate('/products')}
               style={{ backgroundColor: '#d4af37', borderColor: '#d4af37', color: '#000', fontWeight: '600' }}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Checkout Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isConfirmed ? (
            <Alert variant="success">Thank you! Your order is confirmed.</Alert>
          ) : (
            <Form onSubmit={handleConfirmPayment}>
              <p><strong>Total:</strong> ${total}</p>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={!!emailError}
                />
                <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" style={{ backgroundColor: '#d4af37', borderColor: '#d4af37', color: '#000' }}>
                Confirm Payment
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CartPage;