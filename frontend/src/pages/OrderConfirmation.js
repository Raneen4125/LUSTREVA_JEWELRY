// src/pages/OrderConfirmation.js
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { useCart } from '../context/CartContext';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaMapMarkerAlt, FaCreditCard, FaMoneyBillWave, FaPhone, FaBuilding } from 'react-icons/fa';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const OrderConfirmation = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod', // 'cod' or 'card'
    location: 'showroom' // 'showroom' or 'delivery'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();


  // Load saved address from localStorage if available
  useEffect(() => {
    const savedAddress = localStorage.getItem('savedAddress');
    if (savedAddress) {
      try {
        const parsedAddress = JSON.parse(savedAddress);
        setFormData(prev => ({
          ...prev,
          ...parsedAddress
        }));
      } catch (err) {
        console.error('Error parsing saved address:', err);
      }
    }
    
    // Load cart data from location state or context
    const cartFromState = location.state?.cart;
    if (!cartFromState) {
      // Redirect if no cart data
      navigate('/cart');
    }
  }, [navigate, location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: method
    }));
  };

  const handleLocationChange = (loc) => {
    setFormData(prev => ({
      ...prev,
      location: loc
    }));
  };

  const validateForm = () => {
    const { fullName, phone, address, city, postalCode, paymentMethod, location } = formData;
    
    if (!fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    
    if (!phone || phone.length < 10) {
      setError('Valid phone number is required');
      return false;
    }
    
    if (location === 'delivery') {
      if (!address.trim()) {
        setError('Delivery address is required');
        return false;
      }
      if (!city.trim()) {
        setError('City is required');
        return false;
      }
      if (!postalCode.trim()) {
        setError('Postal code is required');
        return false;
      }
    }
    
    return true;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  // 🔥 ADD TOKEN VALIDATION HERE
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
    return;
  }
  
  // Optional: Check if token is expired (simple check)
  try {
    // Decode token to check expiry
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    const payload = JSON.parse(atob(tokenParts[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp < currentTime) {
      // Token expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      return;
    }
  } catch (decodeError) {
    console.error('Token decode error:', decodeError);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    return;
  }
  
  setLoading(true);
  setError('');
  setSuccess('');
  
  try {
    // Save address for future orders
    localStorage.setItem('savedAddress', JSON.stringify({
      fullName: formData.fullName,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode
    }));
    
    // Get cart data from location state
    const cartData = location.state?.cart || [];
    
    // Prepare order data
    const orderData = {
      shippingAddress: {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        location: formData.location
      },
      paymentMethod: formData.paymentMethod,
      items: cartData,
      totalAmount: cartData.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
    };
    
    // Send to backend - token is now validated
    const response = await fetch('${API_URL}/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // ✅ Token is valid
      },
      body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      // 🔥 BETTER ERROR HANDLING FOR AUTH ISSUES
      if (response.status === 403 && (result.error.includes('expired') || result.error.includes('Invalid'))) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
      throw new Error(result.error || 'Failed to place order');
    }
    
    setSuccess('Order placed successfully! We will contact you soon.');
    clearCart();
    
    setTimeout(() => {
      navigate('/myorders');
    }, 2000);
    
  } catch (err) {
    console.error('Order error:', err);
    setError(err.message || 'Failed to place order. Please try again.');
    setLoading(false);
  }
};

  const getPaymentMethodLabel = () => {
    return formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card';
  };

  const getLocationLabel = () => {
    return formData.location === 'showroom' ? 'Pick up from Showroom' : 'Home Delivery';
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          <Card className="shadow-sm border-0" style={{ borderRadius: '12px' }}>
            <Card.Header 
              className="text-center py-4" 
              style={{ 
                background: 'linear-gradient(135deg, #6b4e3d 0%, #8a6b57 100%)',
                borderBottom: 'none'
              }}
            >
              <h2 className="text-white mb-0" style={{ fontFamily: "'Playfair Display', serif" }}>
                Order Confirmation
              </h2>
              <p className="text-white-50 mb-0">Complete your order details</p>
            </Card.Header>
            
            <Card.Body className="p-4">
              {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
              {success && <Alert variant="success" className="mb-3">{success}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                {/* Customer Information */}
                <div className="mb-4">
                  <h5 className="mb-3" style={{ color: '#6b4e3d' }}>
                    <FaBuilding className="me-2" />
                    Customer Information
                  </h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      style={{
                        borderColor: '#e0d5c9',
                        backgroundColor: '#f8f3eb',
                        borderRadius: '8px'
                      }}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      style={{
                        borderColor: '#e0d5c9',
                        backgroundColor: '#f8f3eb',
                        borderRadius: '8px'
                      }}
                    />
                  </Form.Group>
                </div>

                {/* Location Selection */}
                <div className="mb-4">
                  <h5 className="mb-3" style={{ color: '#6b4e3d' }}>
                    <FaMapMarkerAlt className="me-2" />
                    Order Location
                  </h5>
                  
                  <div className="d-flex gap-3 mb-3">
                    <Button
                      variant={formData.location === 'showroom' ? 'dark' : 'outline-dark'}
                      onClick={() => handleLocationChange('showroom')}
                      className="flex-grow-1"
                      style={{
                        backgroundColor: formData.location === 'showroom' ? '#6b4e3d' : 'transparent',
                        borderColor: '#6b4e3d',
                        color: formData.location === 'showroom' ? '#f8f3eb' : '#6b4e3d'
                      }}
                    >
                      <FaMapMarkerAlt className="me-2" />
                      Showroom Pickup
                    </Button>
                    
                    <Button
                      variant={formData.location === 'delivery' ? 'dark' : 'outline-dark'}
                      onClick={() => handleLocationChange('delivery')}
                      className="flex-grow-1"
                      style={{
                        backgroundColor: formData.location === 'delivery' ? '#6b4e3d' : 'transparent',
                        borderColor: '#6b4e3d',
                        color: formData.location === 'delivery' ? '#f8f3eb' : '#6b4e3d'
                      }}
                    >
                      <FaMapMarkerAlt className="me-2" />
                      Home Delivery
                    </Button>
                  </div>
                  
                  {formData.location === 'delivery' && (
                    <div className="delivery-address">
                      <Form.Group className="mb-3">
                        <Form.Label>Street Address *</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Enter your street address"
                          style={{
                            borderColor: '#e0d5c9',
                            backgroundColor: '#f8f3eb',
                            borderRadius: '8px'
                          }}
                        />
                      </Form.Group>
                      
                      <Row>
                        <Col md={8}>
                          <Form.Group className="mb-3">
                            <Form.Label>City *</Form.Label>
                            <Form.Control
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="Enter your city"
                              style={{
                                borderColor: '#e0d5c9',
                                backgroundColor: '#f8f3eb',
                                borderRadius: '8px'
                              }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Postal Code *</Form.Label>
                            <Form.Control
                              type="text"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              placeholder="Postal code"
                              style={{
                                borderColor: '#e0d5c9',
                                backgroundColor: '#f8f3eb',
                                borderRadius: '8px'
                              }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  )}
                  
                  {formData.location === 'showroom' && (
                    <div className="showroom-info p-3 bg-light rounded">
                      <p className="mb-1"><strong>Showroom Address:</strong></p>
                      <p className="mb-1">123 Jewelry Lane</p>
                      <p className="mb-1">Downtown District</p>
                      <p className="mb-0">New York, NY 10001</p>
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div className="mb-4">
                  <h5 className="mb-3" style={{ color: '#6b4e3d' }}>
                    <FaCreditCard className="me-2" />
                    Payment Method
                  </h5>
                  
                  <div className="d-flex gap-3 mb-3">
                    <Button
                      variant={formData.paymentMethod === 'cod' ? 'dark' : 'outline-dark'}
                      onClick={() => handlePaymentMethodChange('cod')}
                      className="flex-grow-1"
                      style={{
                        backgroundColor: formData.paymentMethod === 'cod' ? '#6b4e3d' : 'transparent',
                        borderColor: '#6b4e3d',
                        color: formData.paymentMethod === 'cod' ? '#f8f3eb' : '#6b4e3d'
                      }}
                    >
                      <FaMoneyBillWave className="me-2" />
                      Cash on Delivery
                    </Button>
                    
                    <Button
                      variant={formData.paymentMethod === 'card' ? 'dark' : 'outline-dark'}
                      onClick={() => handlePaymentMethodChange('card')}
                      className="flex-grow-1"
                      style={{
                        backgroundColor: formData.paymentMethod === 'card' ? '#6b4e3d' : 'transparent',
                        borderColor: '#6b4e3d',
                        color: formData.paymentMethod === 'card' ? '#f8f3eb' : '#6b4e3d'
                      }}
                    >
                      <FaCreditCard className="me-2" />
                      Credit Card
                    </Button>
                  </div>
                  
                  <div className="payment-info p-3 bg-light rounded">
                    <p className="mb-0">
                      <strong>Selected:</strong> {getPaymentMethodLabel()}
                    </p>
                    {formData.paymentMethod === 'cod' && (
                      <small className="text-muted">
                        Pay with cash when you receive your order or pick it up from our showroom.
                      </small>
                    )}
                    {formData.paymentMethod === 'card' && (
                      <small className="text-muted">
                        You'll be redirected to a secure payment gateway to complete your payment.
                      </small>
                    )}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mb-4 p-3 bg-light rounded">
                  <h6 className="mb-3" style={{ color: '#6b4e3d' }}>Order Summary</h6>
                  {/* You can add cart items summary here if needed */}
                  <p className="mb-0"><strong>Location:</strong> {getLocationLabel()}</p>
                  <p className="mb-0"><strong>Payment:</strong> {getPaymentMethodLabel()}</p>
                </div>

                <div className="d-grid gap-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="py-2"
                    style={{
                      backgroundColor: '#6b4e3d',
                      borderColor: '#6b4e3d',
                      borderRadius: '25px'
                    }}
                  >
                    {loading ? 'Placing Order...' : 'Confirm Order'}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/cart')}
                    style={{
                      borderColor: '#6b4e3d',
                      color: '#6b4e3d',
                      borderRadius: '25px'
                    }}
                  >
                    Back to Cart
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderConfirmation;