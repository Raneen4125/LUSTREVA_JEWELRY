// src/pages/Settings.js
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaShieldAlt, FaSignOutAlt, FaEdit } from 'react-icons/fa';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const Settings = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: 'client'
  });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = () => {
      try {
        const token = localStorage.getItem('token');
        const userDataStr = localStorage.getItem('user');
        
        if (!token || !userDataStr) {
          navigate('/login');
          return;
        }
        
        const userData = JSON.parse(userDataStr);
        setUserData({
          name: userData.name || '',
          email: userData.email || '',
          role: userData.role || 'client'
        });
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setLoading(false);
      } catch (err) {
        console.error('Error parsing user ', err);
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.dispatchEvent(new Event('authChange'));
  };

  const getRoleDisplayName = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin':
      case 'administrator':
        return 'Administrator';
      case 'client':
      case 'user':
      default:
        return 'Client';
    }
  };

  const getRoleBadgeColor = (role) => {
    return role?.toLowerCase() === 'admin' || role?.toLowerCase() === 'administrator' 
      ? '#6b4e3d' 
      : '#8a6b57';
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode) {
      // Reset form when entering edit mode
      setFormData({
        name: userData.name,
        email: userData.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setError('');
      setSuccess('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return false;
      }
      if (!formData.currentPassword) {
        setError('Please enter your current password to change it');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setError('');
      setSuccess('Updating your profile...');
      
      // TODO: Implement actual API call to update profile
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local storage
      const updatedUser = {
        ...JSON.parse(localStorage.getItem('user')),
        name: formData.name,
        email: formData.email
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUserData({
        name: formData.name,
        email: formData.email,
        role: userData.role
      });
      
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      
      // Refresh navbar if needed
      window.dispatchEvent(new Event('authChange'));
      
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

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
                Account Settings
              </h2>
              <p className="text-white-50 mb-0">Manage your profile and account preferences</p>
            </Card.Header>
            
            <Card.Body className="p-4">
              {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
              {success && <Alert variant="success" className="mb-3">{success}</Alert>}
              
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0" style={{ color: '#6b4e3d' }}>
                    <FaUser className="me-2" />
                    Profile Information
                  </h4>
                  {!editMode && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleEditToggle}
                      className="d-flex align-items-center"
                      style={{ 
                        borderColor: '#6b4e3d',
                        color: '#6b4e3d',
                        borderRadius: '20px'
                      }}
                    >
                      <FaEdit className="me-1" /> Edit
                    </Button>
                  )}
                </div>
                
                {!editMode ? (
                  <div className="profile-display">
                    <div className="mb-3">
                      <label className="form-label fw-bold text-muted small">USERNAME</label>
                      <p className="mb-0" style={{ fontSize: '1.1rem', color: '#333' }}>{userData.name || 'Not set'}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold text-muted small">EMAIL ADDRESS</label>
                      <p className="mb-0" style={{ fontSize: '1.1rem', color: '#333' }}>{userData.email || 'Not set'}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold text-muted small">ACCOUNT TYPE</label>
                      <div className="d-inline-block">
                        <span 
                          className="px-3 py-1 rounded-pill text-white small fw-bold"
                          style={{ 
                            backgroundColor: getRoleBadgeColor(userData.role),
                            fontSize: '0.85rem'
                          }}
                        >
                          {getRoleDisplayName(userData.role)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        style={{
                          borderColor: '#e0d5c9',
                          backgroundColor: '#f8f3eb',
                          borderRadius: '8px'
                        }}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold">Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        style={{
                          borderColor: '#e0d5c9',
                          backgroundColor: '#f8f3eb',
                          borderRadius: '8px'
                        }}
                      />
                    </Form.Group>
                    
                    <div className="border-top pt-4 mt-4">
                      <h5 className="mb-3" style={{ color: '#6b4e3d' }}>
                        <FaLock className="me-2" />
                        Change Password
                      </h5>
                      <p className="text-muted small mb-3">
                        Leave these fields blank if you don't want to change your password
                      </p>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          placeholder="Enter current password"
                          style={{
                            borderColor: '#e0d5c9',
                            backgroundColor: '#f8f3eb',
                            borderRadius: '8px'
                          }}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          placeholder="Enter new password"
                          style={{
                            borderColor: '#e0d5c9',
                            backgroundColor: '#f8f3eb',
                            borderRadius: '8px'
                          }}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-4">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm new password"
                          style={{
                            borderColor: '#e0d5c9',
                            backgroundColor: '#f8f3eb',
                            borderRadius: '8px'
                          }}
                        />
                      </Form.Group>
                    </div>
                    
                    <div className="d-flex gap-2">
                      <Button
                        type="submit"
                        className="flex-grow-1"
                        style={{
                          backgroundColor: '#6b4e3d',
                          borderColor: '#6b4e3d',
                          borderRadius: '25px',
                          padding: '0.6rem 1.5rem'
                        }}
                      >
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={handleEditToggle}
                        style={{
                          borderColor: '#6b4e3d',
                          color: '#6b4e3d',
                          borderRadius: '25px',
                          padding: '0.6rem 1.5rem'
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                )}
              </div>

              <div className="border-top pt-4 mt-4">
                <h4 className="mb-3" style={{ color: '#6b4e3d' }}>
                  <FaShieldAlt className="me-2" />
                  Account Security
                </h4>
                <p className="text-muted mb-3">
                  Manage your account security settings and session
                </p>
                <Button
                  type="button"
                  variant="outline-danger"
                  onClick={handleLogout}
                  className="w-100 d-flex align-items-center justify-content-center"
                  style={{
                    borderRadius: '25px',
                 
                    padding: '0.6rem 1.5rem'
                  }}
                >
                  <FaSignOutAlt className="me-2" /> Logout from all devices
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;