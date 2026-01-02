import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import '../styles/PageLayout.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    const fetchOrders = async () => {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <h4 className="text-muted">Loading your orders...</h4>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2
        className="text-center mb-4"
        style={{ color: '#6b4e3d', fontWeight: '600' }}
      >
        My Order History
      </h2>

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">You haven't placed any orders yet.</p>
          <Button
            variant="outline-dark"
            onClick={() => navigate('/products')}
            className="btn-elegant rounded-pill px-4"
          >
            Browse Jewelry Collection
          </Button>
        </div>
      ) : (
        <Row>
          {orders.map((order) => {
            const totalQuantity = order.items.reduce(
              (sum, item) => sum + Number(item.quantity),
              0
            );

            const amountPaid = order.items.reduce(
              (sum, item) =>
                sum + Number(item.quantity) * Number(item.price || 0),
              0
            );

            return (
              <Col md={6} lg={4} key={order.id} className="mb-4">
                <div
                  className="p-4 rounded shadow-sm h-100"
                  style={{
                    backgroundColor: '#fff',
                    border: '1px solid #eee',
                  }}
                >
                  {/* Date */}
                  <div className="mb-2">
                    <small className="text-muted">
                      Order Date:{' '}
                      <strong>
                        {new Date(order.created_at).toLocaleDateString()}
                      </strong>
                    </small>
                  </div>

                  {/* Items */}
                  <ul
                    className="list-unstyled mb-3"
                    style={{ fontSize: '0.95rem' }}
                  >
                    {order.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="d-flex justify-content-between mb-1"
                      >
                        <span>
                          {item.item_name}
                        </span>
                        <span className="text-muted">× {item.quantity}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Totals */}
                  <div
                    className="pt-3 mt-3"
                    style={{ borderTop: '1px dashed #d8c2aa' }}
                  >
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Total Items</span>
                      <span style={{ fontWeight: '500' }}>
                        {totalQuantity}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Amount Paid</span>
                      <span
                        style={{
                          fontWeight: '600',
                          color: '#6b4e3d',
                          fontSize: '1.05rem',
                        }}
                      >
                       
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="text-end mt-3"
                  >
                    <span
                    variant="light"
                      className="btn-elegant rounded-pill px-4 py-2" 
                      style={{
      fontSize: '0.85rem',
      fontWeight: '500',
      color: '#fff',
      backgroundColor:
        order.status === 'delivered'
          ? '#198754'
          : order.status === 'shipped'
          ? '#0dcaf0'
          : order.status === 'cancelled'
          ? '#dc3545'
          : '#6b4e3d', // ⭐ Pending → same jewelry theme color
    }}>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default MyOrders;
