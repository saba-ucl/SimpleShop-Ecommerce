// All SQL for the users table.

import { db } from '../db/database.js';

// The password is never sent to the frontend (like @JsonProperty WRITE_ONLY in Java),
// so it is only included when explicitly asked for, e.g. to check a login.
const toUser = (row, { includePassword = false } = {}) => {
  if (!row) {
    return undefined;
  }
  const user = { id: row.id, name: row.name, email: row.email, role: row.role };
  if (includePassword) {
    user.password = row.password;
  }
  return user;
};

export const userRepository = {
  findAll() {
    return db.prepare('SELECT * FROM users ORDER BY id').all().map((row) => toUser(row));
  },

  findById(id) {
    return toUser(db.prepare('SELECT * FROM users WHERE id = ?').get(id));
  },

  findByEmailIgnoreCaseWithPassword(email) {
    const row = db.prepare('SELECT * FROM users WHERE lower(email) = lower(?)').get(email);
    return toUser(row, { includePassword: true });
  },

  existsByEmailIgnoreCase(email) {
    return db.prepare('SELECT 1 FROM users WHERE lower(email) = lower(?)').get(email) !== undefined;
  },

  insert({ name, email, password, role }) {
    const result = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)')
      .run(name, email, password, role);
    return this.findById(Number(result.lastInsertRowid));
  },

  count() {
    return db.prepare('SELECT count(*) AS n FROM users').get().n;
  }
};
