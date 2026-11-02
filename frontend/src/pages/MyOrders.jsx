import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrdersByUser } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { formatPrice } from '../utils/currency';

function MyOrders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    getOrdersByUser(user.id)
      .then((response) => setOrders(response.data))
      .catch(() => setError('Could not load your orders.'))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <main className="container py-5"><Loading message="Loading your orders..." /></main>;

  return (
    <main className="container py-5">
      <h1 className="section-title mb-1">My Orders</h1>
      <p className="text-secondary mb-4">Track the orders placed from your account.</p>
      <ErrorMessage message={error} />
      {orders.length === 0 ? (
        <div className="alert alert-info">You have not placed any orders yet. <Link to="/products">Start shopping</Link>.</div>
      ) : (
        <div className="row g-4">
          {orders.map((order) => (
            <div className="col-lg-6" key={order.id}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div><h5 className="mb-1">Order #{order.id}</h5><div className="small text-secondary">{new Date(order.orderDate).toLocaleString()}</div></div>
                    <span className={`badge ${order.status === 'DELIVERED' ? 'text-bg-success' : order.status === 'CANCELLED' ? 'text-bg-danger' : 'text-bg-warning'}`}>{order.status}</span>
                  </div>
                  <hr />
                  {order.items.map((item) => <div className="d-flex justify-content-between small mb-2" key={item.id}><span>{item.product.name} × {item.quantity}</span><span>{formatPrice(Number(item.price))}</span></div>)}
                  <div className="d-flex justify-content-between fw-bold mt-3"><span>Total</span><span>{formatPrice(Number(order.totalAmount))}</span></div>
                  <Link to={`/orders/${order.id}`} className="btn btn-outline-primary btn-sm mt-3">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default MyOrders;
