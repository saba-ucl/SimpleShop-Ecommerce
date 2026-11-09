import StarRating from './StarRating';

function ReviewList({ reviews }) {
  return (
    <section className="mt-5">
      <h2 className="h4 mb-3">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-secondary">No reviews yet.</p>
      ) : (
        <ul className="list-unstyled">
          {reviews.map((review) => (
            <li key={review.id} className="border-bottom py-3">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <StarRating value={review.rating} size="1.1rem" />
                <span className="fw-semibold">{review.reviewerName}</span>
                <span className="text-secondary small">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.comment && <p className="mb-0 mt-2">{review.comment}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ReviewList;
