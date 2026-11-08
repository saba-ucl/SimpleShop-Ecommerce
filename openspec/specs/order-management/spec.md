# order-management Specification

## Purpose
Defines how order status is changed via `PUT /api/orders/{id}/status` and the admin order screens. Only two rules are enforced: cancelled orders are final and cancelling restores stock. Other transitions are unrestricted, unlike the flow described in the README.

## Requirements

### Requirement: Update order status
The system SHALL update an order's status via `PUT /api/orders/{id}/status` with body `{"status": "<name>"}`, matching the name case-insensitively, and return 200 with the order.

#### Scenario: Lowercase status
- **WHEN** `{"status": "shipped"}` is sent
- **THEN** the order status becomes SHIPPED

#### Scenario: Missing status
- **WHEN** the body has no `status`
- **THEN** the response is 400 "Status is required."

#### Scenario: Invalid status
- **WHEN** the value is not a known status
- **THEN** the response is 400

### Requirement: Cancelled is terminal
The system SHALL NOT allow a CANCELLED order to move to any other status.

#### Scenario: Reopen attempt
- **WHEN** a cancelled order is set to PENDING
- **THEN** the response is 400 "A cancelled order cannot be reopened in this simple demo."

### Requirement: Cancel restores stock
When an order moves from a non-cancelled status to CANCELLED, the system SHALL add each item's quantity back to its product's stock. Setting CANCELLED on an already cancelled order SHALL NOT restore stock again.

#### Scenario: Cancel pending order
- **WHEN** a PENDING order with 2 units of a product is cancelled
- **THEN** that product's stock increases by 2

#### Scenario: Cancel delivered order
- **WHEN** a DELIVERED order is cancelled
- **THEN** it is allowed and stock is restored

#### Scenario: Repeat cancel
- **WHEN** CANCELLED is sent for an already cancelled order
- **THEN** stock is not restored a second time

### Requirement: Unrestricted other transitions
The system SHALL allow any non-cancelled order to move to any other status, including backwards or skipping steps. The flow PENDING → CONFIRMED → SHIPPED → DELIVERED is not enforced.

#### Scenario: Skip ahead
- **WHEN** a PENDING order is set to DELIVERED
- **THEN** the change is accepted

#### Scenario: Move backwards
- **WHEN** a DELIVERED order is set to PENDING
- **THEN** the change is accepted

### Requirement: Admin order list
`/admin/orders` SHALL list orders with number, customer name and email, date, total, a status select with all five statuses, and a View link. Changing the select SHALL call the status API and reload. The select SHALL be disabled for CANCELLED orders.

#### Scenario: Change status
- **WHEN** an admin picks SHIPPED in the select
- **THEN** the API is called and the list reloads

### Requirement: Admin order details
`/admin/orders/:id` SHALL show the status select (updating in place), the items table and customer details.

#### Scenario: Cancelled order
- **WHEN** the order is CANCELLED
- **THEN** the select is disabled
