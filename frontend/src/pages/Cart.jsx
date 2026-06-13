import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';

const Cart = () => {
  const { user } = useAuth();
  const { cart, cartTotal, updateQuantity, removeFromCart, loading } = useCart();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container" style={{ marginTop: '4rem' }}>
        <div className="empty-state">
          <FiShoppingBag className="empty-icon" />
          <h2 style={{ marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Please log in to view and add items to your cart.</p>
          <Link to="/login" className="btn btn-primary">
            Log In Now
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <p className="text-center" style={{ color: 'var(--text-secondary)' }}>Loading your shopping cart...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container" style={{ marginTop: '4rem' }}>
        <div className="empty-state">
          <FiShoppingBag className="empty-icon" />
          <h2 style={{ marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '3rem' }}>
      <h1 className="section-title">Your Shopping Cart</h1>

      <div className="cart-layout">
        <div className="cart-items-list">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.product.imageUrl} alt={item.product.name} className="cart-item-img" />
              
              <div className="cart-item-details">
                <span className="cart-item-category">{item.product.category}</span>
                <Link to={`/products/${item.product.id}`}>
                  <h3 className="cart-item-title">{item.product.name}</h3>
                </Link>
                <div className="cart-item-price">${item.product.price.toFixed(2)}</div>
              </div>

              <div className="quantity-controller">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="quantity-btn"
                >
                  <FiMinus />
                </button>
                <div className="quantity-value">{item.quantity}</div>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="quantity-btn"
                  disabled={item.quantity >= item.product.stockQuantity}
                >
                  <FiPlus />
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.product.id)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.6rem', color: 'var(--danger-color)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                title="Remove item"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span style={{ color: 'var(--success-color)' }}>Free</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.5rem' }}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
