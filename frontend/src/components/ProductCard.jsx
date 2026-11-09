import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/currency';
import StarRating from './StarRating';

function ProductCard({ product, onAddToCart, summary }) {
  const outOfStock = product.stock <= 0;

  return (
    <div className="card product-card h-100 border-0 shadow-sm">
      <img
        src={product.imageUrl}
        className="card-img-top product-image"
        alt={product.name}
        onError={(event) => {
          event.currentTarget.src = 'https://placehold.co/900x650?text=SimpleShop';
        }}
      />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <h5 className="card-title mb-0">{product.name}</h5>
          <span className="badge text-bg-light">{product.category?.name}</span>
        </div>
        <p className="card-text text-secondary small flex-grow-1">
          {product.description?.length > 90
            ? `${product.description.slice(0, 90)}...`
            : product.description}
        </p>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="fw-bold fs-5">{formatPrice(Number(product.price))}</span>
          <span className={`small ${outOfStock ? 'text-danger' : 'text-success'}`}>
            {outOfStock ? 'Out of Stock' : `${product.stock} left`}
          </span>
        </div>
        <div className="mb-3 small d-flex align-items-center gap-2 flex-wrap">
          {summary && summary.count > 0 ? (
            <>
              <StarRating value={Math.round(summary.average * 2) / 2} size="1.1rem" />
              <span className="text-secondary">
                {summary.average.toFixed(1)} ★ ({summary.count} {summary.count === 1 ? 'review' : 'reviews'})
              </span>
            </>
          ) : (
            <>
              <StarRating muted size="1.1rem" />
              <span className="text-secondary">No reviews in yet</span>
            </>
          )}
        </div>
        <div className="d-flex gap-2">
          <Link to={`/products/${product.id}`} className="btn btn-outline-primary flex-fill">
            Details
          </Link>
          <button
            className="btn btn-primary flex-fill"
            disabled={outOfStock}
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
