const FILLED = '#f5a623';
const EMPTY = '#ccc';
const MUTED = '#ddd';

// Read-only stars: full, half and empty, based on a value from 0 to 5.
// With `muted`, all five stars are greyed out (used when a product has no reviews yet).
function StarRating({ value = 0, size = '1rem', muted = false }) {
  return (
    <span
      aria-label={muted ? 'No ratings yet' : `${value} out of 5 stars`}
      role="img"
      style={{ fontSize: size, whiteSpace: 'nowrap' }}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        let style = { color: EMPTY };
        if (muted) {
          style = { color: MUTED };
        } else if (value >= star) {
          style = { color: FILLED };
        } else if (value >= star - 0.5) {
          style = {
            background: `linear-gradient(90deg, ${FILLED} 50%, ${EMPTY} 50%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          };
        }
        return (
          <span key={star} style={style} aria-hidden="true">
            ★
          </span>
        );
      })}
    </span>
  );
}

export default StarRating;
