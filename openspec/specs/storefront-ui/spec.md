# storefront-ui Specification

## Purpose
Defines the customer-facing React frontend (Vite, Bootstrap, port 3000): routes, navigation, product browsing and search, product details and currency display. Cart, checkout, order and admin behaviors are in their own specs.

## Requirements

### Requirement: Routes
The frontend SHALL provide public routes `/`, `/products`, `/products/:id`, `/categories`, `/login`, `/register`, `/cart`; login-required routes `/checkout`, `/orders`, `/orders/:id`; ADMIN-only routes under `/admin`; and SHALL redirect any unknown path to `/`.

#### Scenario: Unknown path
- **WHEN** a user opens `/nope`
- **THEN** they are redirected to `/`

### Requirement: Navbar
The navbar SHALL show Home, Products, Categories and Cart (with a badge of total quantity). ADMIN users SHALL see an "Admin" link. Logged-in users SHALL see "Hi, {name}" and Logout; the "My Orders" button SHALL show only for role USER. Logged-out users SHALL see Login and Register.

#### Scenario: Admin navbar
- **WHEN** an ADMIN is logged in
- **THEN** the Admin link is shown and My Orders is not

### Requirement: Home page
The home page SHALL show a hero, category tiles linking to `/products?category={id}`, and the first 4 products from the product list as "Featured products".

#### Scenario: Category tile
- **WHEN** a visitor clicks a category tile
- **THEN** the app opens `/products?category={id}`

### Requirement: Product browsing and search
The products page SHALL load all products and categories once and filter client-side. The search box SHALL match name or description case-insensitively; the category dropdown SHALL stay in sync with the `?category=` URL parameter. It SHALL show "{n} product(s) found" and "No products match your search." when empty.

#### Scenario: Description match
- **WHEN** a visitor searches for a word only in a product's description
- **THEN** that product is listed

### Requirement: Product card
Each card SHALL show image (with a placehold.co fallback on error), name, category badge, description truncated at 90 characters, price, "{stock} left" or "Out of Stock", a Details link and an Add to Cart button disabled when stock <= 0.

#### Scenario: Out of stock card
- **WHEN** stock is 0
- **THEN** "Out of Stock" is shown and Add to Cart is disabled

### Requirement: Product details
`/products/:id` SHALL show image, category, description, price and "{n} items available" or "Out of Stock". When in stock it SHALL offer a quantity input clamped to 1..stock and an "Add N to Cart" button. A load failure SHALL show "Product could not be found."

#### Scenario: Quantity clamp
- **WHEN** a visitor enters a quantity above stock
- **THEN** the input is clamped to the stock value

### Requirement: Currency display
Prices SHALL be stored in DKK. A compile-time `DISPLAY_CURRENCY` constant (default DKK; EUR at 1/7.46; INR at 13) SHALL control display via `Intl.NumberFormat` (da-DK, or en-IN for INR). The admin product form SHALL always use DKK. There SHALL be no runtime currency switcher.

#### Scenario: Default display
- **WHEN** the constant is unchanged
- **THEN** prices render in DKK
