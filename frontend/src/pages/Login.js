// src/components/LoginModal.js
import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Signup from '../pages/Signup';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Login = ({ show, onHide, redirectAfterLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('${API_URL}/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify({
  id: data.user.id,
  name: data.user.name,
  email: data.user.email,
  role: data.user.role || 'client' // Default to client if not provided
}));

localStorage.removeItem('guestCart');
const storageEvent = new Event('storage');
window.dispatchEvent(storageEvent);
onHide();
navigate(redirectAfterLogin);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
      className="login-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">
          <div className="brand-logo">Lustreva</div>
          <div className="text-muted small">Sign in to your account</div>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100 py-2"
            style={{
              backgroundColor: '#6b4e3d',
              borderColor: '#6b4e3d',
              fontWeight: '600'
            }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <small className="text-muted">
            New customer?{' '}
          <Button
  variant="link"
  className="p-0"
  onClick={() => {
    onHide();
    navigate('/signup'); // This will work now
  }}
  style={{ color: '#6b4e3d', textDecoration: 'underline' }}
>
  Create account
</Button>
          </small>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Login;