import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiArrowLeft, FiPlus, FiMinus } from 'react-icons/fi';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleIncrement = () => {
    if (product && quantity < product.stockQuantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    const result = await addToCart(product.id, quantity);
    setAdding(false);
    if (result && result.requireLogin) {
      navigate('/login');
    } else if (result && result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <p className="text-center" style={{ color: 'var(--text-secondary)' }}>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <div className="alert alert-danger">{error || 'Product not found.'}</div>
        <Link to="/" className="btn btn-secondary">
          <FiArrowLeft /> Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <Link to="/" className="btn btn-secondary btn-sm" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center' }}>
        <FiArrowLeft style={{ marginRight: '4px' }} /> Back to Shop
      </Link>

      <div className="product-detail-layout">
        <div className="product-detail-img">
          <img src={product.imageUrl} alt={product.name} />
        </div>

        <div className="product-detail-info">
          <span className="product-detail-cat">{product.category}</span>
          <h1 className="product-detail-title">{product.name}</h1>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <span className={`badge-stock ${product.stockQuantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of Stock'}
            </span>
          </div>

          <div className="product-detail-price">${product.price.toFixed(2)}</div>
          <p className="product-detail-desc">{product.description}</p>

          {product.stockQuantity > 0 && (
            <div className="product-detail-actions">
              <div className="quantity-controller">
                <button onClick={handleDecrement} className="quantity-btn" disabled={quantity <= 1}>
                  <FiMinus />
                </button>
                <div className="quantity-value">{quantity}</div>
                <button onClick={handleIncrement} className="quantity-btn" disabled={quantity >= product.stockQuantity}>
                  <FiPlus />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`btn btn-primary ${success ? 'btn-success' : ''}`}
                disabled={adding}
                style={{ flexGrow: 1 }}
              >
                <FiShoppingCart size={18} />
                {success ? 'Added to Cart!' : (adding ? 'Adding...' : 'Add to Cart')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
