import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { user } = useAuth();
  const { cart, cartTotal, clearCartState } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  
  // Mock Payment Card State
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (cart.length === 0) {
    return <Navigate to="/cart" />;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          shippingAddress: address,
          contactNumber: phone
        })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Checkout failed. Please check product stock quantities.');
      }

      // Order created successfully
      clearCartState(); // local state clear
      navigate('/orders', { state: { orderPlaced: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div className="container" style={{ marginTop: '3rem' }}>
      <h1 className="section-title">Checkout</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handlePlaceOrder} className="checkout-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Shipping Address */}
          <div className="cart-summary" style={{ width: '100%' }}>
            <h2 className="summary-title" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Shipping Details</h2>
            <div className="form-group">
              <label className="form-label">Full Address</label>
              <textarea
                className="form-input"
                rows="3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Apartment, Street Name, City, Zip Code"
                style={{ resize: 'none' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          {/* Visual Credit Card & Form */}
          <div className="cart-summary" style={{ width: '100%' }}>
            <h2 className="summary-title" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Payment Details</h2>
            
            {/* Visual Credit Card */}
            <div className="payment-card-visual">
              <div className="visual-chip"></div>
              <div className="visual-number">
                {cardNumber || "•••• •••• •••• ••••"}
              </div>
              <div className="visual-footer">
                <div>
                  <span style={{ fontSize: '0.65rem', display: 'block', textTransform: 'uppercase', opacity: 0.8 }}>Cardholder</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{cardName.toUpperCase() || "YOUR NAME"}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', display: 'block', textTransform: 'uppercase', opacity: 0.8 }}>Expires</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{cardExpiry || "MM/YY"}</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Cardholder Name</label>
              <input
                type="text"
                className="form-input"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Card Number</label>
              <input
                type="text"
                className="form-input"
                maxLength="19"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                required
                placeholder="4111 2222 3333 4444"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Expiration Date</label>
                <input
                  type="text"
                  maxLength="5"
                  className="form-input"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  required
                  placeholder="MM/YY"
                />
              </div>
              <div className="form-group">
                <label className="form-label">CVV</label>
                <input
                  type="password"
                  maxLength="3"
                  className="form-input"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  required
                  placeholder="•••"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Preview */}
        <div className="cart-summary" style={{ height: 'fit-content' }}>
          <h2 className="summary-title">Your Order</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {item.product.name} <strong style={{ color: 'white' }}>x {item.quantity}</strong>
                </span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="summary-row" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span style={{ color: 'var(--success-color)' }}>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total Amount</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.5rem' }}
            disabled={loading}
          >
            {loading ? 'Processing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
