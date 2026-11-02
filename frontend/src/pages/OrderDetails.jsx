import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrder } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { formatPrice } from '../utils/currency';

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrder(id)
      .then((response) => setOrder(response.data))
      .catch(() => setError('Order could not be found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <main className="container py-5"><Loading message="Loading order..." /></main>;
  if (error) return <main className="container py-5"><ErrorMessage message={error} /></main>;

  return (
    <main className="container py-5">
      <Link to="/orders" className="text-decoration-none">← Back to My Orders</Link>
      <div className="card border-0 shadow-sm mt-3">
        <div className="card-body p-4">
          <div className="d-flex flex-wrap justify-content-between gap-3">
            <div><h1 className="h3 mb-1">Order #{order.id}</h1><p className="text-secondary mb-0">{new Date(order.orderDate).toLocaleString()}</p></div>
            <span className="badge text-bg-primary align-self-start p-2">{order.status}</span>
          </div>
          <div className="row g-4 mt-2">
            <div className="col-lg-7">
              <h5>Ordered Products</h5>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
                  <tbody>{order.items.map((item) => <tr key={item.id}><td>{item.product.name}</td><td>{item.quantity}</td><td>{formatPrice(Number(item.price))}</td><td>{formatPrice(Number(item.price) * item.quantity)}</td></tr>)}</tbody>
                </table>
              </div>
              <div className="text-end fw-bold fs-5">Total: {formatPrice(Number(order.totalAmount))}</div>
            </div>
            <div className="col-lg-5">
              <div className="bg-light rounded-4 p-4">
                <h5>Delivery Details</h5>
                <p className="mb-1"><strong>{order.customerName}</strong></p>
                <p className="small mb-1">{order.email}</p>
                <p className="small mb-1">{order.phone}</p>
                <p className="small mb-0">{order.address}, {order.city}, {order.state} - {order.pincode}</p>
              </div>
              <div className="alert alert-light border mt-3 mb-0">Payment method: Cash on Delivery / Demo Payment.</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrderDetails;
