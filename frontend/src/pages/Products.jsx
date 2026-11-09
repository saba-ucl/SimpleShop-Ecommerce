import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategories, getProducts, getReviewSummary } from '../services/api';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function Products({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const [searchText, setSearchText] = useState('');
  const [categoryId, setCategoryId] = useState(initialCategory);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([productResponse, categoryResponse]) => {
        setProducts(productResponse.data);
        setCategories(categoryResponse.data);
      })
      .catch(() => setError('Could not load products. Make sure the backend is running.'))
      .finally(() => setLoading(false));

    // Ratings are optional: if this fails, the cards simply show the "no reviews" state.
    getReviewSummary()
      .then((response) => setSummaries(response.data))
      .catch(() => setSummaries({}));
  }, []);

  const filteredProducts = useMemo(() => {
    const search = searchText.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch = !search || product.name.toLowerCase().includes(search) || product.description?.toLowerCase().includes(search);
      const matchesCategory = !categoryId || String(product.category?.id) === String(categoryId);
      return matchesSearch && matchesCategory;
    });
  }, [products, searchText, categoryId]);

  const handleCategoryChange = (value) => {
    setCategoryId(value);
    if (value) setSearchParams({ category: value });
    else setSearchParams({});
  };

  return (
    <main className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <h1 className="section-title mb-1">All Products</h1>
          <p className="text-secondary mb-0">Search and filter products easily.</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <label className="form-label">Search</label>
              <input className="form-control" placeholder="Search by product name or description" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Category</label>
              <select className="form-select" value={categoryId} onChange={(e) => handleCategoryChange(e.target.value)}>
                <option value="">All categories</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <ErrorMessage message={error} />
      {loading ? <Loading message="Loading products..." /> : (
        <>
          <div className="mb-3 text-secondary">{filteredProducts.length} product(s) found</div>
          <div className="row g-4">
            {filteredProducts.map((product) => (
              <div className="col-sm-6 col-lg-4 col-xl-3" key={product.id}>
                <ProductCard product={product} onAddToCart={onAddToCart} summary={summaries[product.id]} />
              </div>
            ))}
          </div>
          {filteredProducts.length === 0 && <div className="alert alert-warning mt-4">No products match your search.</div>}
        </>
      )}
    </main>
  );
}

export default Products;
