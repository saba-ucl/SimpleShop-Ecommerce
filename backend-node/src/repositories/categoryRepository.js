// All SQL for the categories table.

import { db } from '../db/database.js';

const toCategory = (row) => row && {
  id: row.id,
  name: row.name,
  description: row.description
};

export const categoryRepository = {
  findAll() {
    return db.prepare('SELECT * FROM categories ORDER BY id').all().map(toCategory);
  },

  findById(id) {
    return toCategory(db.prepare('SELECT * FROM categories WHERE id = ?').get(id));
  },

  existsByNameIgnoreCase(name) {
    return db.prepare('SELECT 1 FROM categories WHERE lower(name) = lower(?)').get(name) !== undefined;
  },

  insert({ name, description }) {
    const result = db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)')
      .run(name, description ?? null);
    return this.findById(Number(result.lastInsertRowid));
  },

  update(id, { name, description }) {
    db.prepare('UPDATE categories SET name = ?, description = ? WHERE id = ?')
      .run(name, description ?? null, id);
    return this.findById(id);
  },

  delete(id) {
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  },

  count() {
    return db.prepare('SELECT count(*) AS n FROM categories').get().n;
  }
};
