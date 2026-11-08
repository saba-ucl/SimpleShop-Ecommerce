# product-catalog Specification

## Purpose
Defines the product resource exposed by `/api/products`: its fields, listing and filtering, and create, update and delete rules. Products belong to exactly one category and carry price (DKK) and stock.

## Requirements

### Requirement: Product data model
The system SHALL represent a product with `id`, `name`, `description` (max 1000, optional), `price` (decimal 10,2), `stock` (integer), `imageUrl` (max 1000, optional) and a required `category`.

#### Scenario: Product response
- **WHEN** a product is returned
- **THEN** it includes `id, name, description, price, stock, imageUrl` and `category` as `{id, name, description}`

### Requirement: List and filter products
The system SHALL return all products from `GET /api/products`, optionally filtered by `keyword` or `categoryId`. A non-blank `keyword` SHALL match product name case-insensitively (substring) and SHALL take precedence over `categoryId`. The list SHALL be unsorted and unpaginated.

#### Scenario: No filters
- **WHEN** a client calls `GET /api/products`
- **THEN** the response is 200 with all products

#### Scenario: Keyword filter
- **WHEN** a client calls `GET /api/products?keyword=lap`
- **THEN** only products whose name contains "lap" (any case) are returned

#### Scenario: Category filter
- **WHEN** a client calls `GET /api/products?categoryId=2` with no keyword
- **THEN** only products in category 2 are returned

#### Scenario: Keyword overrides category
- **WHEN** both `keyword` and `categoryId` are supplied
- **THEN** `categoryId` is ignored

### Requirement: Get product by id
The system SHALL return a single product from `GET /api/products/{id}`.

#### Scenario: Missing product
- **WHEN** the id does not exist
- **THEN** the response is 400 "Product not found with id: {id}"

### Requirement: Create product
The system SHALL create a product via `POST /api/products` and return 201 with the saved product. `name` MUST be non-blank, `price` MUST be present and >= 0 (zero allowed), `stock` MUST be present and >= 0, and `categoryId` MUST be present and refer to an existing category.

#### Scenario: Valid product
- **WHEN** a valid body is posted
- **THEN** the response is 201 with the new product

#### Scenario: Unknown category
- **WHEN** `categoryId` does not exist
- **THEN** the response is 400 "Category not found."

#### Scenario: Negative stock
- **WHEN** `stock` is negative
- **THEN** the response is 400 with a message starting "stock: "

### Requirement: Update product
The system SHALL fully overwrite a product via `PUT /api/products/{id}` using the same body and validation as create, returning 200 with the updated product.

#### Scenario: Missing product
- **WHEN** the id does not exist
- **THEN** the response is 400 "Product not found with id: {id}"

### Requirement: Delete product
The system SHALL delete a product via `DELETE /api/products/{id}` and return 204. A product referenced by any order item SHALL NOT be deleted.

#### Scenario: Unreferenced product
- **WHEN** a product has no order items
- **THEN** the response is 204 and the product is gone

#### Scenario: Referenced product
- **WHEN** the product appears in an order
- **THEN** the response is 400 "This record is still used by another record and cannot be deleted."
