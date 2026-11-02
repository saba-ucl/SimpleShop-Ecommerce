import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/currency';

function Cart({ cart, onIncrease, onDecrease, onRemove, onClear }) {
  const total = cart.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <main className="container py-5 text-center">
        <div className="py-5">
          <div className="display-1">🛒</div>
          <h1 className="h3 mt-3">Your cart is empty</h1>
          <p className="text-secondary">Add a few products and come back here.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="section-title mb-1">Shopping Cart</h1>
          <p className="text-secondary mb-0">Review your items before checkout.</p>
        </div>
        <button className="btn btn-outline-danger btn-sm" onClick={onClear}>Clear Cart</button>
      </div>

      <div className="row g-4 align-items-start">
        <div className="col-lg-8">
          <div className="table-responsive bg-white rounded-4 shadow-sm">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr><th>Product</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th></th></tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.product.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img src={item.product.imageUrl} alt={item.product.name} className="cart-thumb" />
                        <div><div className="fw-semibold">{item.product.name}</div><div className="small text-secondary">{item.product.category?.name}</div></div>
                      </div>
                    </td>
                    <td>{formatPrice(Number(item.product.price))}</td>
                    <td>
                      <div className="btn-group btn-group-sm" role="group">
                        <button className="btn btn-outline-secondary" onClick={() => onDecrease(item.product.id)}>−</button>
                        <span className="btn btn-outline-secondary disabled">{item.quantity}</span>
                        <button className="btn btn-outline-secondary" onClick={() => onIncrease(item.product.id)} disabled={item.quantity >= item.product.stock}>+</button>
                      </div>
                    </td>
                    <td className="fw-semibold">{formatPrice(Number(item.product.price) * item.quantity)}</td>
                    <td><button className="btn btn-link text-danger text-decoration-none" onClick={() => onRemove(item.product.id)}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold">Order Summary</h5>
              <div className="d-flex justify-content-between mt-3"><span>Items</span><span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span></div>
              <div className="d-flex justify-content-between mt-2"><span>Delivery</span><span className="text-success">Free</span></div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5"><span>Total</span><span>{formatPrice(total)}</span></div>
              <Link to="/checkout" className="btn btn-primary w-100 mt-4">Proceed to Checkout</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Cart;
