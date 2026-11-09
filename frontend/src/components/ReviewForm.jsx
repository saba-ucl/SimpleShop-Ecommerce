import { useEffect, useState } from 'react';
import { createReview, getOrdersByUser } from '../services/api';
import StarRating from './StarRating';

const COMMENT_MAX_LENGTH = 250;

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('simpleshopUser'));
  } catch {
    return null;
  }
}

function formatOrderLabel(order) {
  return `Order #${order.id} - ${new Date(order.orderDate).toLocaleDateString()}`;
}

function ReviewForm({ productId, reviews = [], onSubmitted }) {
  const [user] = useState(getStoredUser);
  // The customer's DELIVERED orders that contain this product, newest first.
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    getOrdersByUser(user.id)
      .then((response) => {
        // /orders/user/{id} returns the newest order first, so the first match is the latest order.
        const delivered = response.data.filter(
          (o) => o.status === 'DELIVERED' && o.items?.some((item) => item.product?.id === Number(productId))
        );
        setOrders(delivered);
        setSelectedOrderId(delivered.length > 0 ? delivered[0].id : null);
      })
      .catch(() => {
        setOrders([]);
        setSelectedOrderId(null);
      });
  }, [user, productId]);

  const handleOrderChange = (event) => {
    setSelectedOrderId(Number(event.target.value));
    setRating(0);
    setComment('');
    setMessage('');
    setError('');
  };

  if (!user?.id || orders.length === 0 || selectedOrderId === null) return null;

  // The review this customer already left for the selected order, if any.
  const existingReview = reviews.find(
    (review) => review.orderId === selectedOrderId && review.productId === Number(productId)
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    if (rating < 1) {
      setError('Please choose a star rating.');
      return;
    }
    setSubmitting(true);
    try {
      await createReview({ userId: user.id, orderId: selectedOrderId, productId: Number(productId), rating, comment });
      setMessage('Thank you! Your review has been saved.');
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || 'Your review could not be saved.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-4">
      <h2 className="h5">Review this product</h2>

      {orders.length > 1 && (
        <div className="mb-3">
          <label htmlFor="review-order" className="form-label">Choose the order you want to review</label>
          <select
            id="review-order"
            className="form-select"
            value={selectedOrderId}
            onChange={handleOrderChange}
          >
            {orders.map((order) => (
              <option key={order.id} value={order.id}>{formatOrderLabel(order)}</option>
            ))}
          </select>
        </div>
      )}

      {message && <div className="alert alert-success py-2">{message}</div>}

      {existingReview ? (
        <div className="border rounded p-3">
          <div className="text-secondary small mb-1">You have already reviewed this product for this order.</div>
          <StarRating value={existingReview.rating} size="1.3rem" />
          {existingReview.comment && <p className="mb-0 mt-2">{existingReview.comment}</p>}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-2" role="radiogroup" aria-label="Star rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="btn btn-link p-0 me-1 fs-3 text-decoration-none"
                style={{ color: star <= rating ? '#f5a623' : '#ccc' }}
                aria-label={`${star} star${star > 1 ? 's' : ''}`}
                aria-checked={star === rating}
                role="radio"
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>
          <div className="mb-3">
            <label htmlFor="review-comment" className="form-label">Comment (optional)</label>
            <textarea
              id="review-comment"
              className="form-control"
              rows="3"
              maxLength={COMMENT_MAX_LENGTH}
              placeholder="Share a few words about this product"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
            <div className="form-text text-end">{comment.length}/{COMMENT_MAX_LENGTH}</div>
          </div>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <button type="submit" className="btn btn-outline-primary" disabled={submitting}>
            Submit review
          </button>
        </form>
      )}
    </section>
  );
}

export default ReviewForm;
