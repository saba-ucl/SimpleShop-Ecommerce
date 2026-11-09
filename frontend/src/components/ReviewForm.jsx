import { useEffect, useState } from 'react';
import { createReview, getOrdersByUser } from '../services/api';

const COMMENT_MAX_LENGTH = 250;

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('simpleshopUser'));
  } catch {
    return null;
  }
}

function ReviewForm({ productId, onSubmitted }) {
  const [user] = useState(getStoredUser);
  const [order, setOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    getOrdersByUser(user.id)
      .then((response) => {
        const delivered = response.data.find(
          (o) => o.status === 'DELIVERED' && o.items?.some((item) => item.product?.id === Number(productId))
        );
        setOrder(delivered || null);
      })
      .catch(() => setOrder(null));
  }, [user, productId]);

  if (!user?.id || !order) return null;

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
      await createReview({ userId: user.id, orderId: order.id, productId: Number(productId), rating, comment });
      setMessage('Thank you! Your review has been saved.');
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || 'Your review could not be saved.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      <h2 className="h5">Review this product</h2>
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
      {message && <div className="alert alert-success py-2">{message}</div>}
      <button type="submit" className="btn btn-outline-primary" disabled={submitting}>
        Submit review
      </button>
    </form>
  );
}

export default ReviewForm;
