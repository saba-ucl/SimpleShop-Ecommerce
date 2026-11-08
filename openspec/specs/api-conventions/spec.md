# api-conventions Specification

## Purpose
Defines the cross-cutting behavior of the SimpleShop REST API under `/api`: error response shape, status codes, CORS, and the absence of backend authentication. Other capability specs rely on these conventions.

## Requirements

### Requirement: Error response shape
The system SHALL return every error response as a JSON object with a single `message` string field.

#### Scenario: Business rule failure
- **WHEN** a request fails a business rule (for example an unknown product id)
- **THEN** the response status is 400
- **AND** the body is `{"message": "<explanation>"}`

### Requirement: Not-found is reported as 400
The system SHALL report a missing resource referenced by id as HTTP 400 with a descriptive message, not HTTP 404.

#### Scenario: Unknown product id
- **WHEN** a client requests `GET /api/products/{id}` for an id that does not exist
- **THEN** the response status is 400
- **AND** the message is "Product not found with id: {id}"

### Requirement: Bean validation errors
The system SHALL reject requests that fail Bean Validation with HTTP 400 and the message `"<field>: <default message>"` for the first failing field, or "Invalid request data." when no field error is available.

#### Scenario: Blank required field
- **WHEN** a request body has a blank `name` where `@NotBlank` applies
- **THEN** the response status is 400
- **AND** the message starts with "name: "

### Requirement: Referential integrity errors
The system SHALL map database integrity violations to HTTP 400 with the message "This record is still used by another record and cannot be deleted."

#### Scenario: Deleting a product that appears in an order
- **WHEN** a client deletes a product referenced by an order item
- **THEN** the response status is 400
- **AND** the message is "This record is still used by another record and cannot be deleted."

### Requirement: Framework and unexpected errors
The system SHALL return the framework's own status code and message for Spring `ErrorResponse` exceptions (for example unknown URL or unsupported method), and HTTP 500 with the message "An unexpected server error occurred." for any other exception.

#### Scenario: Unsupported method
- **WHEN** a client sends a method that a route does not support
- **THEN** the response status is 405

#### Scenario: Unexpected failure
- **WHEN** an unhandled exception occurs
- **THEN** the response status is 500
- **AND** the message is "An unexpected server error occurred."

### Requirement: CORS policy
The system SHALL allow cross-origin requests on `/api/**` only from origin `http://localhost:3000`, with methods GET, POST, PUT, DELETE and OPTIONS and any headers.

#### Scenario: Frontend dev server origin
- **WHEN** a browser at `http://localhost:3000` calls the API
- **THEN** the request is permitted by CORS

### Requirement: No backend authentication
The system SHALL NOT authenticate or authorize API requests; every endpoint, including admin-oriented ones, is open. Role checks exist only in the frontend.

#### Scenario: Admin endpoint without credentials
- **WHEN** an unauthenticated client calls `GET /api/users`
- **THEN** the system returns the user list

### Requirement: Password handling
The system SHALL store and compare passwords as plain text and SHALL never include the password in any JSON response.

#### Scenario: User serialization
- **WHEN** a user is returned from any endpoint
- **THEN** the JSON contains no `password` field

### Requirement: Server configuration
The system SHALL listen on `127.0.0.1:8181` and use an in-memory H2 database (`ecommerce_db`) that is reset on each restart.

#### Scenario: Restart
- **WHEN** the backend restarts
- **THEN** all data is discarded and sample data is re-seeded
