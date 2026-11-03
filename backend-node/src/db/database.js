// The database: SQLite running in memory, built into Node.js (node:sqlite).
// Nothing to install. Like H2 in the Java backend, all data is reset when
// the server stops.

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

// node:sqlite is built into Node.js 22.13 and newer. Loading it this way lets us
// print a clear message on older versions instead of a cryptic error.
let DatabaseSync;
try {
  ({ DatabaseSync } = createRequire(import.meta.url)('node:sqlite'));
} catch {
  console.error(`This backend needs Node.js 22.13 or newer (you have ${process.version}).`);
  console.error('Install the current LTS version from https://nodejs.org and try again.');
  process.exit(1);
}

export const db = new DatabaseSync(':memory:');

// SQLite only checks foreign keys when this is switched on.
db.exec('PRAGMA foreign_keys = ON');

// Create the tables from schema.sql.
db.exec(readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));

// Runs `work` inside a transaction: either all changes are saved, or none.
// Used when one request changes several rows, e.g. placing an order.
export function transaction(work) {
  db.exec('BEGIN');
  try {
    const result = work();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}
