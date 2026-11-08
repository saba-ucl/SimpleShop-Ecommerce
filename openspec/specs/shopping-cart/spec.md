# shopping-cart Specification

## Purpose
Defines the client-side shopping cart. The cart lives entirely in the React app and browser localStorage; the backend has no cart concept. Stock limits are enforced from a snapshot taken when items are added.

## Requirements

### Requirement: Cart persistence
The frontend SHALL store the cart in localStorage under `simpleshopCart` as an array of `{product, quantity}` with a product snapshot.

#### Scenario: Reload
- **WHEN** the page is reloaded
- **THEN** the cart contents are restored

### Requirement: Add to cart
The frontend SHALL add a product to the cart with quantity capped at the product's stock. Out-of-stock products SHALL NOT be added.

#### Scenario: New item
- **WHEN** a product with stock 5 is added with quantity 8
- **THEN** the cart line quantity is 5

#### Scenario: Out of stock
- **WHEN** a product with stock <= 0 is added
- **THEN** an alert "This product is out of stock." is shown and the cart is unchanged

#### Scenario: Existing item at max
- **WHEN** the cart already holds the maximum stock of the product
- **THEN** an alert "You already have the maximum available stock in your cart." is shown and nothing changes

### Requirement: Adjust quantities
The cart page SHALL provide `+` and `-` buttons per line. `+` SHALL be disabled at the stock limit; `-` SHALL remove the line when quantity reaches 0. Each line SHALL have a Remove button and the cart a "Clear Cart" button.

#### Scenario: Decrement last unit
- **WHEN** a line with quantity 1 is decremented
- **THEN** the line is removed

### Requirement: Cart page summary
The cart page SHALL show product, price, quantity controls, subtotal and remove per line, plus total item count, "Delivery: Free", the total and a "Proceed to Checkout" link. An empty cart SHALL show "Your cart is empty" with a Browse Products link.

#### Scenario: Empty cart
- **WHEN** the cart has no lines
- **THEN** the empty message and link are shown

### Requirement: Guests and checkout
Guests SHALL be able to view and edit the cart but `/checkout` SHALL redirect them to `/login`.

#### Scenario: Guest proceeds to checkout
- **WHEN** a logged-out user opens `/checkout`
- **THEN** they are redirected to `/login`

### Requirement: Stale stock
Cart stock data SHALL NOT be revalidated until the backend rejects an order.

#### Scenario: Stock dropped after add
- **WHEN** stock falls below the cart quantity and the user checks out
- **THEN** the backend responds 400 "Not enough stock for product: {name}"
