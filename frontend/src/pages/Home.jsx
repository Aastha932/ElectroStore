import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(["All", "Electronics", "Clothing", "Home", "Books"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [error, setError] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = 'http://localhost:8080/api/products';
        if (searchQuery) {
          url = `http://localhost:8080/api/products/search?query=${encodeURIComponent(searchQuery)}`;
        } else if (activeCategory !== "All") {
          url = `http://localhost:8080/api/products/category/${encodeURIComponent(activeCategory)}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Could not fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, activeCategory]);

  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Discover Premium Essentials</h1>
          <p className="hero-subtitle">Experience high-quality items in Electronics, Clothing, Home, and Books. Handpicked for your lifestyle.</p>
        </div>
      </section>

      <div className="container">
        <div className="category-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {searchQuery && (
          <h2 style={{ marginBottom: '1.5rem', fontWeight: 500, fontSize: '1.25rem' }}>
            Search Results for: <span style={{ color: 'var(--accent-color)' }}>"{searchQuery}"</span>
          </h2>
        )}

        {loading ? (
          <div className="text-center" style={{ padding: '4rem 0' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Loading catalog...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3 style={{ marginBottom: '0.5rem' }}>No Products Found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search filters or browse other categories.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
