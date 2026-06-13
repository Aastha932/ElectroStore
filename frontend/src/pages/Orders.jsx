import React, { useState, useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiPackage, FiMapPin, FiPhone } from 'react-icons/fi';

const Orders = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const showSuccess = location.state?.orderPlaced || false;

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/orders/my-orders', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (!response.ok) {
          throw new Error('Could not fetch order history.');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const getStatusClass = (status) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED': return 'status-delivered';
      case 'SHIPPED': return 'status-shipped';
      case 'CANCELLED': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container" style={{ marginTop: '3rem' }}>
      <h1 className="section-title">Your Orders</h1>

      {showSuccess && (
        <div className="alert alert-success">
          Thank you for your purchase! Your order has been placed successfully.
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p className="text-center" style={{ color: 'var(--text-secondary)' }}>Loading order history...</p>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <FiPackage className="empty-icon" />
          <h2 style={{ marginBottom: '0.5rem' }}>No Orders Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You haven't placed any orders yet.</p>
          <Link to="/" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-header-info">
                  <div className="order-info-block">
                    <span>Order Date</span>
                    <p>{formatDate(order.orderDate)}</p>
                  </div>
                  <div className="order-info-block">
                    <span>Order ID</span>
                    <p>#{order.id}</p>
                  </div>
                  <div className="order-info-block">
                    <span>Total Amount</span>
                    <p style={{ color: 'white', fontWeight: 700 }}>${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                <span className={`order-status-badge ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-items">
                <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="order-item-row">
                      <div className="order-item-info">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          style={{ width: '60px', height: '60px', borderRadius: '0.25rem', objectFit: 'cover', backgroundColor: '#0f172a' }}
                        />
                        <div>
                          <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.product.name}</h4>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            Quantity: {item.quantity} @ ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiMapPin size={16} />
                    <span><strong>Address:</strong> {order.shippingAddress}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiMapPin size={16} style={{ opacity: 0 }} /> {/* spacer */}
                    <span><strong>Contact:</strong> {order.contactNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
