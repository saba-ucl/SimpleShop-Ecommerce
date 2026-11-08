# sample-data Specification

## Purpose
Defines the demo data seeded into the in-memory database at startup so the shop is usable immediately: categories, products, users and historical orders. Credentials are for local demo use only.

## Requirements

### Requirement: Guarded seeding
The system SHALL seed categories only when none exist and users only when none exist, at application startup.

#### Scenario: Fresh start
- **WHEN** the backend starts with an empty database
- **THEN** categories, products, users and sample orders are created

### Requirement: Seed categories and products
The system SHALL create the categories Electronics, Clothing, Books and Accessories, and 60 products priced in DKK: 10 with Unsplash images (for example Laptop 5999.00 stock 12, Smartphone 2999.00 stock 20) and 50 with `https://placehold.co/900x650?text=<name>` images.

#### Scenario: Product count
- **WHEN** seeding completes
- **THEN** `GET /api/products` returns 60 products across the four categories

### Requirement: Seed users
The system SHALL create `admin@example.com` / `admin123` (ADMIN, "SimpleShop Admin"), `user@example.com` / `user123` (USER, "Demo User"), and 40 customers `firstname.lastname@example.com` with password `password123` and role USER, with æ, ø, å transliterated to ae, oe, aa in emails.

#### Scenario: Admin login
- **WHEN** `admin@example.com` logs in with `admin123`
- **THEN** the response is 200 with role ADMIN

### Requirement: Seed orders
The system SHALL generate about 250 deterministic sample orders (fixed random seed 2026) with 1–4 distinct products each, quantity 1 (70%), 2 (20%) or 3 (10%), snapshotted prices, Danish customer details, and dates between 0 and 365 days ago with about 15% in the last 14 days. About 7% SHALL be CANCELLED; other statuses depend on age (under 2 days PENDING; 2–3 PENDING or CONFIRMED; 4–6 CONFIRMED or SHIPPED; 7–13 SHIPPED or DELIVERED; 14+ DELIVERED). Sample orders SHALL NOT decrement stock.

#### Scenario: Old order status
- **WHEN** a non-cancelled sample order is 20 days old
- **THEN** its status is DELIVERED

#### Scenario: Stock untouched
- **WHEN** seeding completes
- **THEN** product stock equals the seeded values
