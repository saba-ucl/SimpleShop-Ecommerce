import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProducts, getReviewSummary } from '../services/api';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function Home({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([productResponse, categoryResponse]) => {
        setProducts(productResponse.data);
        setCategories(categoryResponse.data);
      })
      .catch(() => setError('Could not load the home page data. Make sure the backend is running.'))
      .finally(() => setLoading(false));

    // Ratings are optional: if this fails, the cards simply show the "no reviews" state.
    getReviewSummary()
      .then((response) => setSummaries(response.data))
      .catch(() => setSummaries({}));
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="badge text-bg-light text-primary mb-3">Simple. Useful. Beginner-friendly.</span>
              <h1 className="display-4 fw-bold">Everything you need, in one SimpleShop.</h1>
              <p className="lead mt-3 mb-4">
                Explore products, add them to your cart, place a demo order and manage the store from a simple admin dashboard.
              </p>
              <Link to="/products" className="btn btn-light btn-lg px-4">Shop Products</Link>
            </div>
            <div className="col-lg-5">
              <div className="hero-card card border-0 shadow-lg">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between mb-3">
                    <span>⚡ Fast browsing</span><span>✓</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>🛒 Easy cart</span><span>✓</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>📦 Simple order tracking</span><span>✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container py-5">
        <ErrorMessage message={error} />
        {loading ? <Loading message="Loading products..." /> : (
          <>
            <section className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h2 className="section-title mb-1">Shop by category</h2>
                  <p className="text-secondary mb-0">Start with what you need.</p>
                </div>
                <Link to="/categories" className="btn btn-outline-primary btn-sm">View All</Link>
              </div>
              <div className="row g-3">
                {categories.map((category) => (
                  <div className="col-sm-6 col-lg-3" key={category.id}>
                    <Link to={`/products?category=${category.id}`} className="text-decoration-none">
                      <div className="category-tile h-100 p-4 bg-white rounded-4 shadow-sm">
                        <div className="fs-2 mb-2">{category.name === 'Electronics' ? '💻' : category.name === 'Clothing' ? '👕' : category.name === 'Books' ? '📚' : '🎒'}</div>
                        <h5 className="text-dark">{category.name}</h5>
                        <p className="small text-secondary mb-0">{category.description}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h2 className="section-title mb-1">Featured products</h2>
                  <p className="text-secondary mb-0">A few popular demo products.</p>
                </div>
                <Link to="/products" className="btn btn-outline-primary btn-sm">See All Products</Link>
              </div>
              <div className="row g-4">
                {products.slice(0, 4).map((product) => (
                  <div className="col-sm-6 col-lg-3" key={product.id}>
                    <ProductCard product={product} onAddToCart={onAddToCart} summary={summaries[product.id]} />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}

export default Home;
