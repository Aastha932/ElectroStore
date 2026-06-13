import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiEdit, FiTrash2, FiShoppingBag, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  
  if (!user || !isAdmin) {
    return <Navigate to="/" />;
  }

  const [activeTab, setActiveTab] = useState("products"); // products or orders
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form / Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null if adding new
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    imageUrl: "",
    category: "Electronics"
  });

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/orders', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchOrders()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      description: "",
      price: "",
      stockQuantity: "",
      imageUrl: "",
      category: "Electronics"
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl,
      category: product.category
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`http://localhost:8080/api/products/${productId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (res.ok) {
        setSuccess("Product deleted successfully!");
        fetchProducts();
      } else {
        const text = await res.text();
        throw new Error(text || "Failed to delete product");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const url = editingProduct 
      ? `http://localhost:8080/api/products/${editingProduct.id}`
      : 'http://localhost:8080/api/products';
    
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price),
          stockQuantity: parseInt(productForm.stockQuantity)
        })
      });

      if (res.ok) {
        setSuccess(editingProduct ? "Product updated successfully!" : "Product added successfully!");
        setIsModalOpen(false);
        fetchProducts();
      } else {
        const text = await res.text();
        throw new Error(text || "Failed to save product");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`http://localhost:8080/api/orders/${orderId}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: getHeaders()
      });

      if (res.ok) {
        setSuccess(`Order #${orderId} status updated to ${newStatus}`);
        fetchOrders();
      } else {
        const text = await res.text();
        throw new Error(text || "Failed to update order status");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Compute Stats
  const totalRevenue = orders.reduce((sum, order) => order.status.toUpperCase() !== 'CANCELLED' ? sum + order.totalAmount : sum, 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;

  return (
    <div className="container" style={{ marginTop: '3rem' }}>
      <h1 className="section-title">Admin Dashboard</h1>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Stats Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Total Revenue</div>
          <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiDollarSign style={{ color: 'var(--success-color)' }} /> {totalRevenue.toFixed(2)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Total Orders</div>
          <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiShoppingBag style={{ color: 'var(--accent-color)' }} /> {totalOrdersCount}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Total Products</div>
          <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiTrendingUp style={{ color: 'var(--warning-color)' }} /> {totalProductsCount}
          </div>
        </div>
      </div>

      {/* Dashboard Core Layout */}
      <div className="admin-layout">
        <div className="admin-sidebar">
          <button 
            className={`sidebar-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Manage Products
          </button>
          <button 
            className={`sidebar-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Manage Orders
          </button>
        </div>

        <div className="admin-content">
          {loading ? (
            <p className="text-center" style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
          ) : activeTab === 'products' ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Catalog Directory</h2>
                <button onClick={handleOpenAddModal} className="btn btn-primary btn-sm">
                  <FiPlus /> Add New Product
                </button>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod.id}>
                        <td>
                          <img src={prod.imageUrl} alt={prod.name} className="admin-table-img" />
                        </td>
                        <td style={{ fontWeight: 500, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {prod.name}
                        </td>
                        <td>{prod.category}</td>
                        <td>${prod.price.toFixed(2)}</td>
                        <td>{prod.stockQuantity}</td>
                        <td>
                          <div className="table-actions">
                            <button onClick={() => handleOpenEditModal(prod)} className="btn btn-secondary btn-sm" title="Edit Product">
                              <FiEdit />
                            </button>
                            <button onClick={() => handleDeleteProduct(prod.id)} className="btn btn-secondary btn-sm" style={{ color: 'var(--danger-color)' }} title="Delete Product">
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Customer Orders Master List</h2>
              
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Email</th>
                      <th>Total Amount</th>
                      <th>Shipping Address</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td style={{ fontWeight: 600 }}>#{order.id}</td>
                        <td>{order.user.email}</td>
                        <td>${order.totalAmount.toFixed(2)}</td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{order.shippingAddress}</td>
                        <td>
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                            style={{
                              backgroundColor: 'var(--primary-light)',
                              color: 'white',
                              border: '1px solid var(--border-color)',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.25rem',
                              cursor: 'pointer',
                              fontWeight: 600
                            }}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Dialog for Add/Edit Product */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                  placeholder="e.g. Mechanical Keyboard"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Home">Home</option>
                    <option value="Books">Books</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    required
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-input"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                    placeholder="29.99"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                    required
                    placeholder="50"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows="4"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  required
                  placeholder="Provide product specifications and marketing copy..."
                  style={{ resize: 'none' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                {editingProduct ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
