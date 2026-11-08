# admin-dashboard Specification

## Purpose
Defines the admin area of SimpleShop: the dashboard counts endpoint, the admin pages for products, categories and users, and the frontend-only route protection. Order administration is covered by the order-management spec.

## Requirements

### Requirement: Dashboard counts
The system SHALL return `{"products":N,"categories":N,"users":N,"orders":N}` from `GET /api/dashboard/counts` with status 200.

#### Scenario: Counts
- **WHEN** a client calls the endpoint
- **THEN** each field equals the current number of records

### Requirement: Route protection
The frontend SHALL redirect users with no login to `/login` for protected routes, and non-ADMIN users to `/` for `/admin/**` routes. Protection SHALL exist only in the frontend.

#### Scenario: Guest opens admin
- **WHEN** a logged-out user opens `/admin`
- **THEN** they are redirected to `/login`

#### Scenario: Regular user opens admin
- **WHEN** a USER opens `/admin/products`
- **THEN** they are redirected to `/`

### Requirement: Admin dashboard page
`/admin` SHALL show four count cards (Products, Categories, Users, Orders) linking to their pages, plus management cards.

#### Scenario: Card link
- **WHEN** the admin clicks the Products card
- **THEN** the app navigates to `/admin/products`

### Requirement: Admin product management
`/admin/products` SHALL list products (image, name and ID, category, price, stock) with View, Edit and Delete actions and a client-side name filter. Delete SHALL ask for browser confirmation and show the server error on failure. `/admin/products/add` and `/admin/products/edit/:id` SHALL use a form with name, price (min 0, step 0.01, in DKK), stock (min 0), category, image URL and description, and navigate to `/admin/products` on success.

#### Scenario: Delete blocked
- **WHEN** an admin deletes a product used in an order
- **THEN** the server error message is displayed

### Requirement: Admin category management
`/admin/categories` SHALL combine an add/edit form (name, description) and a table with Edit and Delete (with confirmation), showing server errors.

#### Scenario: Delete category with products
- **WHEN** the admin deletes a category that has products
- **THEN** "Cannot delete a category that still has products." is shown

### Requirement: Admin user list
`/admin/users` SHALL show a read-only table of ID, name, email and role badge.

#### Scenario: View users
- **WHEN** an admin opens the page
- **THEN** all users are listed without edit actions
