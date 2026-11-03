// All SQL for the orders and order_items tables.
// Every order is returned with its items, and every item with its product.

import { db } from '../db/database.js';
import { toProduct } from './productRepository.js';

const toOrder = (row) => row && {
  id: row.id,
  orderDate: row.order_date,
  totalAmount: row.total_amount,
  status: row.status,
  customerName: row.customer_name,
  email: row.email,
  phone: row.phone,
  address: row.address,
  city: row.city,
  state: row.state,
  pincode: row.pincode,
  items: []
};

// Loads the items (with product and category) for a list of orders
// with one extra query, instead of one query per order.
function attachItems(orders) {
  if (orders.length === 0) {
    return orders;
  }
  const byId = new Map(orders.map((order) => [order.id, order]));
  const placeholders = orders.map(() => '?').join(', ');
  const rows = db.prepare(`
    SELECT oi.id       AS item_id,
           oi.order_id AS item_order_id,
           oi.quantity AS item_quantity,
           oi.price    AS item_price,
           p.*,
           c.name        AS category_name,
           c.description AS category_description
    FROM order_items oi
    JOIN products   p ON p.id = oi.product_id
    JOIN categories c ON c.id = p.category_id
    WHERE oi.order_id IN (${placeholders})
    ORDER BY oi.id`).all(...byId.keys());

  for (const row of rows) {
    byId.get(row.item_order_id).items.push({
      id: row.item_id,
      product: toProduct(row),
      quantity: row.item_quantity,
      price: row.item_price
    });
  }
  return orders;
}

export const orderRepository = {
  // Newest first, like the Java backend.
  findAll() {
    const orders = db.prepare('SELECT * FROM orders ORDER BY order_date DESC, id DESC').all().map(toOrder);
    return attachItems(orders);
  },

  findById(id) {
    const order = toOrder(db.prepare('SELECT * FROM orders WHERE id = ?').get(id));
    return order && attachItems([order])[0];
  },

  findByUserId(userId) {
    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC, id DESC')
      .all(userId)
      .map(toOrder);
    return attachItems(orders);
  },

  // Saves an order and its items. Returns the new order id.
  insert(order, items) {
    const result = db.prepare(`
      INSERT INTO orders (user_id, order_date, total_amount, status, customer_name,
                          email, phone, address, city, state, pincode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(order.userId, order.orderDate, order.totalAmount, order.status, order.customerName,
        order.email, order.phone, order.address, order.city, order.state, order.pincode);
    const orderId = Number(result.lastInsertRowid);

    const insertItem = db.prepare(
      'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
    for (const item of items) {
      insertItem.run(orderId, item.productId, item.quantity, item.price);
    }
    return orderId;
  },

  updateStatus(id, status) {
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
  },

  count() {
    return db.prepare('SELECT count(*) AS n FROM orders').get().n;
  }
};
