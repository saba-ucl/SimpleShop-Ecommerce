import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';
import { formatPrice } from '../utils/currency';

function Checkout({ user, cart, onClear }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

  if (!user) {
    return <main className="container py-5"><div className="alert alert-info">Please login before checkout.</div></main>;
  }

  if (cart.length === 0) {
    return <main className="container py-5"><div className="alert alert-warning">Your cart is empty.</div></main>;
  }

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await createOrder({
        userId: user.id,
        ...form,
        items: cart.map((item) => ({ productId: item.product.id, quantity: item.quantity }))
      });
      onClear();
      navigate(`/orders/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place the order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container py-5">
      <div className="row g-4">
        <div className="col-lg-7">
          <h1 className="section-title mb-1">Checkout</h1>
          <p className="text-secondary">Enter delivery details. This project uses demo Cash on Delivery.</p>
          <ErrorMessage message={error} />
          <form className="card border-0 shadow-sm" onSubmit={handleSubmit}>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-6"><label className="form-label">Customer Name</label><input className="form-control" name="customerName" value={form.customerName} onChange={handleChange} required /></div>
                <div className="col-md-6"><label className="form-label">Email</label><input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required /></div>
                <div className="col-md-6"><label className="form-label">Phone</label><input className="form-control" name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder="12 34 56 78" pattern="(\+[0-9]{1,3} ?)?[0-9 ]{8,14}" title="Enter a phone number with at least 8 digits, e.g. 12 34 56 78 or +45 12345678" required /></div>
                <div className="col-12"><label className="form-label">Address</label><textarea className="form-control" rows="3" name="address" value={form.address} onChange={handleChange} required></textarea></div>
                <div className="col-md-4"><label className="form-label">City</label><input className="form-control" name="city" value={form.city} onChange={handleChange} required /></div>
                <div className="col-md-4"><label className="form-label">Region</label><input className="form-control" name="state" value={form.state} onChange={handleChange} required /></div>
                <div className="col-md-4"><label className="form-label">Postal Code</label><input className="form-control" name="pincode" value={form.pincode} onChange={handleChange} placeholder="2100" pattern="[0-9]{4,6}" title="Enter a postal code with 4-6 digits, e.g. 2100" required /></div>
              </div>

              <div className="alert alert-light border mt-4 mb-0">
                <strong>Payment:</strong> Cash on Delivery / Demo Payment. No real payment gateway is connected.
              </div>
            </div>
            <div className="card-footer bg-white border-0 p-4 pt-0">
              <button className="btn btn-primary btn-lg w-100" disabled={loading}>{loading ? 'Placing Order...' : 'Place Order'}</button>
            </div>
          </form>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm sticky-lg-top" style={{ top: '90px' }}>
            <div className="card-body p-4">
              <h5 className="fw-bold">Your Order</h5>
              {cart.map((item) => (
                <div className="d-flex justify-content-between gap-3 mt-3" key={item.product.id}>
                  <span>{item.product.name} × {item.quantity}</span>
                  <span className="fw-semibold">{formatPrice(Number(item.product.price) * item.quantity)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Checkout;
