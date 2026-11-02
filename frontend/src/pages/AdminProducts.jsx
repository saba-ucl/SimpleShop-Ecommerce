import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteProduct, getProducts } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { formatPrice } from '../utils/currency';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = () => {
    setLoading(true);
    getProducts()
      .then((response) => setProducts(response.data))
      .catch(() => setError('Could not load products.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadProducts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete product.');
    }
  };

  const filtered = products.filter((product) => product.name.toLowerCase().includes(keyword.toLowerCase()));

  return (
    <main className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div><h1 className="section-title mb-1">Product Management</h1><p className="text-secondary mb-0">CRUD operations for products.</p></div>
        <Link to="/admin/products/add" className="btn btn-primary">+ Add Product</Link>
      </div>
      <ErrorMessage message={error} />
      <div className="card border-0 shadow-sm mb-4"><div className="card-body"><label className="form-label">Search products</label><input className="form-control" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Type a product name" /></div></div>
      {loading ? <Loading /> : (
        <div className="table-responsive bg-white rounded-4 shadow-sm">
          <table className="table align-middle mb-0">
            <thead className="table-light"><tr><th>Image</th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td><img className="admin-thumb" src={product.imageUrl} alt={product.name} /></td>
                  <td><div className="fw-semibold">{product.name}</div><div className="small text-secondary">ID: {product.id}</div></td>
                  <td>{product.category?.name}</td>
                  <td>{formatPrice(Number(product.price))}</td>
                  <td>{product.stock}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link className="btn btn-sm btn-outline-secondary" to={`/products/${product.id}`}>View</Link>
                      <Link className="btn btn-sm btn-outline-primary" to={`/admin/products/edit/${product.id}`}>Edit</Link>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(product.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default AdminProducts;
