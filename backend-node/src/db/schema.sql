-- SimpleShop database schema (SQLite).
-- Same tables and columns as the Java backend, where Hibernate creates them
-- from the entity classes.

CREATE TABLE categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    description TEXT,
    price       REAL    NOT NULL,          -- price in DKK
    stock       INTEGER NOT NULL,
    image_url   TEXT,
    category_id INTEGER NOT NULL REFERENCES categories (id)
);

CREATE TABLE users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name     TEXT NOT NULL,
    email    TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,                -- plain text: demo only, never do this in a real app
    role     TEXT NOT NULL CHECK (role IN ('ADMIN', 'USER'))
);

CREATE TABLE orders (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL REFERENCES users (id),
    order_date    TEXT    NOT NULL,        -- local date and time, e.g. '2026-05-21T20:49:00'
    total_amount  REAL    NOT NULL,        -- total in DKK
    status        TEXT    NOT NULL CHECK (status IN ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
    customer_name TEXT    NOT NULL,
    email         TEXT    NOT NULL,
    phone         TEXT    NOT NULL,
    address       TEXT    NOT NULL,
    city          TEXT    NOT NULL,
    state         TEXT    NOT NULL,        -- shown as "Region" in the frontend
    pincode       TEXT    NOT NULL         -- shown as "Postal Code" in the frontend
);

CREATE TABLE order_items (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id   INTEGER NOT NULL REFERENCES orders (id),
    product_id INTEGER NOT NULL REFERENCES products (id),
    quantity   INTEGER NOT NULL,
    price      REAL    NOT NULL            -- product price at the time of the order
);
