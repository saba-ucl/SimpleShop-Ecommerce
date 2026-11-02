import { useEffect, useState } from 'react';
import { BASE_CURRENCY } from '../utils/currency';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  imageUrl: '',
  categoryId: ''
};

function ProductForm({ categories, initialProduct, onSubmit, submitLabel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialProduct) {
      setForm({
        name: initialProduct.name || '',
        description: initialProduct.description || '',
        price: initialProduct.price ?? '',
        stock: initialProduct.stock ?? '',
        imageUrl: initialProduct.imageUrl || '',
        categoryId: initialProduct.category?.id || ''
      });
    }
  }, [initialProduct]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: Number(form.categoryId)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card card-body shadow-sm">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Product Name</label>
          <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="col-md-3">
          <label className="form-label">Price ({BASE_CURRENCY})</label>
          <input className="form-control" type="number" min="0" step="0.01" name="price" value={form.price} onChange={handleChange} required />
        </div>
        <div className="col-md-3">
          <label className="form-label">Stock</label>
          <input className="form-control" type="number" min="0" name="stock" value={form.stock} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Category</label>
          <select className="form-select" name="categoryId" value={form.categoryId} onChange={handleChange} required>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Image URL</label>
          <input className="form-control" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
        </div>
        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows="4" name="description" value={form.description} onChange={handleChange}></textarea>
        </div>
      </div>
      <div className="mt-4 d-flex gap-2">
        <button className="btn btn-primary" type="submit">{submitLabel}</button>
      </div>
    </form>
  );
}

export default ProductForm;
