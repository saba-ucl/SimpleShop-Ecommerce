# checkout-and-orders Specification

## Purpose
Defines order creation (checkout) and order retrieval in the SimpleShop backend and the frontend checkout and order-viewing pages. Orders snapshot prices, decrement stock immediately and start as PENDING. Payment is not modelled.

## Requirements

### Requirement: Order data model
The system SHALL represent an order with `id`, `user`, `orderDate`, `totalAmount`, `status` (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED), `customerName`, `email`, `phone`, `address`, `city`, `state`, `pincode`, and `items`. Each item has `product`, `quantity` and a unit `price`.

#### Scenario: Order response
- **WHEN** an order is returned
- **THEN** it includes its items with product and unit price, and does not serialize the `user` object

### Requirement: Create order
The system SHALL create an order via `POST /api/orders` returning 201. The body MUST contain `userId`, `customerName`, `email` (valid), `phone`, `address`, `city`, `state`, `pincode` (all non-blank) and a non-empty `items` list where each item has `productId` and `quantity` >= 1.

#### Scenario: Valid order
- **WHEN** a valid body is posted for an existing user and in-stock products
- **THEN** the response is 201
- **AND** the status is PENDING and `orderDate` is the current time

#### Scenario: Unknown user
- **WHEN** `userId` does not exist
- **THEN** the response is 400 "User not found."

#### Scenario: Unknown product
- **WHEN** an item references a missing product
- **THEN** the response is 400 "Product not found with id: {id}"

#### Scenario: Empty items
- **WHEN** `items` is empty
- **THEN** the response is 400 with a message starting "items: "

### Requirement: Price snapshot and total
The system SHALL set each item's price to the product's price at order time, and `totalAmount` to the sum of `price * quantity`. There SHALL be no shipping, tax or discount.

#### Scenario: Later price change
- **WHEN** a product's price changes after an order
- **THEN** the existing order item price is unchanged

### Requirement: Stock check and decrement
The system SHALL require `product.stock >= quantity` for every line and decrement stock at creation. The whole order SHALL be created in one transaction and rolled back on any failure.

#### Scenario: Insufficient stock
- **WHEN** any line exceeds available stock
- **THEN** the response is 400 "Not enough stock for product: {name}"
- **AND** no order is created and no stock changes

#### Scenario: Successful decrement
- **WHEN** an order for quantity 2 succeeds
- **THEN** the product's stock decreases by 2

### Requirement: Duplicate product lines
The system SHALL validate and decrement each line independently without merging lines for the same product.

#### Scenario: Same product twice
- **WHEN** one product appears in two lines
- **THEN** each line is checked against current stock in turn and stored as a separate item

### Requirement: Read orders
The system SHALL return orders from `GET /api/orders` (all, newest first), `GET /api/orders/{id}`, and `GET /api/orders/user/{userId}` (newest first). No ownership checks apply.

#### Scenario: Unknown user's orders
- **WHEN** `userId` matches no user
- **THEN** the response is 200 with `[]`

#### Scenario: Missing order
- **WHEN** the order id does not exist
- **THEN** the response is 400 "Order not found with id: {id}"

### Requirement: Checkout page
The frontend SHALL require login for `/checkout`, prefill name and email from the user, and require name, email, phone (`(\+[0-9]{1,3} ?)?[0-9 ]{8,14}`), address, city, Region and Postal Code (`[0-9]{4,6}`). Payment SHALL be shown as "Cash on Delivery / Demo Payment".

#### Scenario: Successful checkout
- **WHEN** the user submits valid details
- **THEN** the cart is cleared and the app navigates to `/orders/{newId}`

#### Scenario: Backend rejection
- **WHEN** the API returns an error
- **THEN** the server `message` is displayed

#### Scenario: Empty cart
- **WHEN** the cart is empty
- **THEN** "Your cart is empty." is shown

### Requirement: Customer order pages
`/orders` SHALL list the logged-in user's orders as cards showing number, date, a status badge (green DELIVERED, red CANCELLED, yellow otherwise), items, total and a details link. `/orders/:id` SHALL show items, totals, delivery details and the payment note.

#### Scenario: No orders
- **WHEN** the user has no orders
- **THEN** an empty state links to products
