import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaInstagram } from 'react-icons/fa';
import '../styles/PageLayout.css';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('✅ Form submitted - about to send POST request');
  console.log('Form data:', formData);
  
  setShowAlert(false);
  
  try {
    console.log('📡 Sending POST request to /contact...');
    
    const response = await fetch('http://localhost:5000/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      })
    });
    
    console.log('📡 Response received:', response.status);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      console.log('✅ Message sent successfully!');
      setShowAlert(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setShowAlert(false), 4000);
    } else {
      // Handle non-JSON response
      const text = await response.text();
      console.error('❌ Received non-JSON response:', text);
      throw new Error('Server returned an error');
    }
    
  } catch (error) {
    console.error('💥 Contact form error:', error);
    alert('Failed to send message: ' + error.message);
  }
};

  return (
    <Container className="py-5" style={{ backgroundColor: '#f8f3eb' }}>
      <h2 className="text-center mb-5" style={{ color: '#6b4e3d', fontFamily: "'Playfair Display', serif" }}>
        Contact Us
      </h2>
      <p className="text-center mb-5" style={{ color: '#666', fontSize: '1.1rem' }}>
        We’d love to hear from you. Get in touch for consultations, custom designs, or questions.
      </p>

      <Row>
        {/* Left Column: Contact Info */}
        <Col md={5} className="mb-4 mb-md-0">
          <div className="p-4 rounded shadow-sm" style={{ backgroundColor: '#fff', border: '1px solid #e0d5c9' }}>
            <h4 style={{ color: '#6b4e3d', fontWeight: '600' }}>Visit Our Showroom</h4>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              <FaMapMarkerAlt className="me-2" style={{ color: '#6b4e3d' }} /> 123 Jewelry Lane<br />
              Downtown District<br />
              New York, NY 10001
            </p>
          </div>

          <div className="p-4 rounded shadow-sm mt-4" style={{ backgroundColor: '#fff', border: '1px solid #e0d5c9' }}>
            <h4 style={{ color: '#6b4e3d', fontWeight: '600' }}>Call Us</h4>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              <FaPhone className="me-2" style={{ color: '#6b4e3d' }} /> (555) 123-4567<br />
              Toll Free: (800) 555-GEMS
            </p>
          </div>

          <div className="p-4 rounded shadow-sm mt-4" style={{ backgroundColor: '#fff', border: '1px solid #e0d5c9' }}>
            <h4 style={{ color: '#6b4e3d', fontWeight: '600' }}>Email Us</h4>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              <FaEnvelope className="me-2" style={{ color: '#6b4e3d' }} /> info@lustreva.com<br />
              custom@lustreva.com
            </p>
          </div>

          {/* Updated Instagram section (non-clickable) */}
          <div className="p-4 rounded shadow-sm mt-4" style={{ backgroundColor: '#fff', border: '1px solid #e0d5c9' }}>
            <h4 style={{ color: '#6b4e3d', fontWeight: '600' }}>Follow Us</h4>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              <FaInstagram className="me-2" style={{ color: '#6b4e3d' }} /> Instagram: <strong>@lustreva.shop</strong><br />
              <em style={{ fontSize: '0.9rem' }}>Follow us for new arrivals and styling tips!</em>
            </p>
          </div>
        </Col>

        {/* Right Column: Contact Form */}
        <Col md={7}>
          <div
            className="p-4 rounded"
            style={{
              backgroundColor: '#b89c8cff',
              border: '1px solid #e0d5c9',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              
            }}
          >
            <h4 style={{ color: '#6b4e3d', fontWeight: '600', textAlign: 'center' }}>Send Us a Message</h4>
            
            {showAlert && (
              <div
                style={{
                  backgroundColor: "#6b4e3d",
                  color: "#f8f3eb",
                  padding: "1rem",
                  marginBottom: "1rem",
                  textAlign: "center",
                  borderRadius: "20px",
                  fontWeight: "600",
                  boxShadow: "0 4px 10px rgba(107, 78, 61, 0.2)",
                  animation: "fadeIn 0.4s ease"
                }}
              >
                💎 Thank you! We’ll get back to you soon.
              </div>
            )}

            <Form onSubmit={handleSubmit} className="mt-4">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Subject *</Form.Label>
                    <Form.Select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option>Custom Design Inquiry</option>
                      <option>Product Question</option>
                      <option>Order Support</option>
                      <option>General Inquiry</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Message *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your jewelry needs..."
                  required
                />
              </Form.Group>
              <Button
                type="submit"
                style={{
                  backgroundColor: '#6b4e3d',
                  borderColor: '#6b4e3d',
                  color: '#f8f3eb',
                  fontWeight: '600',
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '30px'
                }}
              >
                Send Message
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;