// All SQL for the products table.
// Every product is returned together with its category, like in the Java backend.

import { db } from '../db/database.js';

const SELECT_PRODUCT = `
  SELECT p.*,
         c.name        AS category_name,
         c.description AS category_description
  FROM products p
  JOIN categories c ON c.id = p.category_id`;

export const toProduct = (row) => row && {
  id: row.id,
  name: row.name,
  description: row.description,
  price: row.price,
  stock: row.stock,
  imageUrl: row.image_url,
  category: {
    id: row.category_id,
    name: row.category_name,
    description: row.category_description
  }
};

// Escapes % and _ so a search for "100%" finds the text "100%" literally.
const escapeLike = (text) => text.replace(/[\\%_]/g, (c) => '\\' + c);

export const productRepository = {
  findAll() {
    return db.prepare(`${SELECT_PRODUCT} ORDER BY p.id`).all().map(toProduct);
  },

  findById(id) {
    return toProduct(db.prepare(`${SELECT_PRODUCT} WHERE p.id = ?`).get(id));
  },

  // LIKE in SQLite ignores upper/lower case for the letters A-Z.
  findByNameContainingIgnoreCase(keyword) {
    return db.prepare(`${SELECT_PRODUCT} WHERE p.name LIKE ? ESCAPE '\\' ORDER BY p.id`)
      .all(`%${escapeLike(keyword)}%`)
      .map(toProduct);
  },

  findByCategoryId(categoryId) {
    return db.prepare(`${SELECT_PRODUCT} WHERE p.category_id = ? ORDER BY p.id`)
      .all(categoryId)
      .map(toProduct);
  },

  existsByCategoryId(categoryId) {
    return db.prepare('SELECT 1 FROM products WHERE category_id = ?').get(categoryId) !== undefined;
  },

  insert({ name, description, price, stock, imageUrl, categoryId }) {
    const result = db.prepare(`
      INSERT INTO products (name, description, price, stock, image_url, category_id)
      VALUES (?, ?, ?, ?, ?, ?)`)
      .run(name, description ?? null, price, stock, imageUrl ?? null, categoryId);
    return this.findById(Number(result.lastInsertRowid));
  },

  update(id, { name, description, price, stock, imageUrl, categoryId }) {
    db.prepare(`
      UPDATE products
      SET name = ?, description = ?, price = ?, stock = ?, image_url = ?, category_id = ?
      WHERE id = ?`)
      .run(name, description ?? null, price, stock, imageUrl ?? null, categoryId, id);
    return this.findById(id);
  },

  updateStock(id, stock) {
    db.prepare('UPDATE products SET stock = ? WHERE id = ?').run(stock, id);
  },

  delete(id) {
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
  },

  count() {
    return db.prepare('SELECT count(*) AS n FROM products').get().n;
  }
};
