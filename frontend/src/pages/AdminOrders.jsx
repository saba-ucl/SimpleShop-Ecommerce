import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, updateOrderStatus } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { formatPrice } from '../utils/currency';

const statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = () => {
    setLoading(true);
    getOrders().then((response) => setOrders(response.data)).catch(() => setError('Could not load orders.')).finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const handleStatusChange = async (order, status) => {
    try {
      await updateOrderStatus(order.id, status);
      loadOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update order status.');
    }
  };

  return (
    <main className="container py-5">
      <div className="mb-4"><h1 className="section-title mb-1">Order Management</h1><p className="text-secondary mb-0">View orders and update their status.</p></div>
      <ErrorMessage message={error} />
      {loading ? <Loading /> : <div className="table-responsive bg-white rounded-4 shadow-sm"><table className="table align-middle mb-0"><thead className="table-light"><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th>Details</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td>#{order.id}</td><td><div className="fw-semibold">{order.customerName}</div><div className="small text-secondary">{order.email}</div></td><td>{new Date(order.orderDate).toLocaleString()}</td><td>{formatPrice(Number(order.totalAmount))}</td><td><select className="form-select form-select-sm" value={order.status} onChange={(e) => handleStatusChange(order, e.target.value)} disabled={order.status === 'CANCELLED'}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td><td><Link className="btn btn-sm btn-outline-primary" to={`/admin/orders/${order.id}`}>View</Link></td></tr>)}</tbody></table></div>}
    </main>
  );
}

export default AdminOrders;
