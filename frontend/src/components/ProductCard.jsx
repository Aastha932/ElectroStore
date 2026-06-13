import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiEye } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setAdding(true);
    const result = await addToCart(product.id, 1);
    setAdding(false);
    if (result && result.requireLogin) {
      navigate('/login');
    } else if (result && result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <div className="product-image-container">
          <span className="product-category-tag">{product.category}</span>
          <img src={product.imageUrl} alt={product.name} className="product-image" />
        </div>
      </Link>
      <div className="product-info">
        <Link to={`/products/${product.id}`}>
          <h3 className="product-title">{product.name}</h3>
        </Link>
        <p className="product-desc">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to={`/products/${product.id}`} className="btn btn-secondary btn-sm" title="View Details">
              <FiEye size={14} />
            </Link>
            <button
              onClick={handleAddToCart}
              className={`btn btn-primary btn-sm ${success ? 'btn-success' : ''}`}
              disabled={adding || product.stockQuantity === 0}
            >
              <FiShoppingCart size={14} />
              {product.stockQuantity <= 0 ? 'Out of Stock' : (success ? 'Added' : (adding ? 'Adding...' : 'Add'))}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
