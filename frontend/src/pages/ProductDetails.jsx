import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct, getReviews } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import { formatPrice } from '../utils/currency';

function ProductDetails({ onAddToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);

  const loadReviews = () => {
    getReviews(id)
      .then((response) => setReviews(response.data))
      .catch(() => setReviews([]));
  };

  useEffect(() => {
    getProduct(id)
      .then((response) => setProduct(response.data))
      .catch(() => setError('Product could not be found.'))
      .finally(() => setLoading(false));
    loadReviews();
  }, [id]);

  if (loading) return <main className="container py-5"><Loading message="Loading product..." /></main>;
  if (error) return <main className="container py-5"><ErrorMessage message={error} /></main>;
  if (!product) return null;

  const outOfStock = product.stock <= 0;

  return (
    <main className="container py-5">
      <Link to="/products" className="text-decoration-none">← Back to products</Link>
      <div className="row g-5 mt-1 align-items-center">
        <div className="col-lg-6">
          <img src={product.imageUrl} alt={product.name} className="img-fluid rounded-4 shadow-sm details-image" onError={(event) => { event.currentTarget.src = 'https://placehold.co/900x650?text=SimpleShop'; }} />
        </div>
        <div className="col-lg-6">
          <span className="badge text-bg-light mb-2">{product.category?.name}</span>
          <h1 className="display-6 fw-bold">{product.name}</h1>
          <p className="text-secondary fs-5">{product.description}</p>
          <div className="fs-2 fw-bold mb-2">{formatPrice(Number(product.price))}</div>
          <p className={outOfStock ? 'text-danger fw-semibold' : 'text-success fw-semibold'}>
            {outOfStock ? 'Out of Stock' : `${product.stock} items available`}
          </p>

          {!outOfStock && (
            <div className="row g-2 align-items-end mt-3">
              <div className="col-sm-4">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(event) => setQuantity(Math.max(1, Math.min(product.stock, Number(event.target.value))))}
                />
              </div>
              <div className="col-sm-8">
                <button className="btn btn-primary btn-lg w-100" onClick={() => onAddToCart(product, quantity)}>
                  Add {quantity} to Cart
                </button>
              </div>
            </div>
          )}

          <ReviewForm productId={product.id} reviews={reviews} onSubmitted={loadReviews} />
        </div>
      </div>

      <ReviewList reviews={reviews} />
    </main>
  );
}

export default ProductDetails;
