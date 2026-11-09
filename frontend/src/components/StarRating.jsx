const FILLED = '#f5a623';
const EMPTY = '#ccc';

// Read-only stars: full, half and empty, based on a value from 0 to 5.
function StarRating({ value = 0, size = '1rem' }) {
  return (
    <span aria-label={`${value} out of 5 stars`} role="img" style={{ fontSize: size, whiteSpace: 'nowrap' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        let style = { color: EMPTY };
        if (value >= star) {
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
